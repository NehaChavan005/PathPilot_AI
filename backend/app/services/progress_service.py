from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.assessment import AssessmentResult
from app.models.course import Course
from app.models.progress import (
    Enrollment,
    Progress,
    ProgressHistory,
    STATUS_COMPLETED,
    STATUS_IN_PROGRESS,
    STATUS_NOT_STARTED,
    status_for_percentage,
)


def _course_or_404(db: Session, course_id: int) -> Course:
    course = db.query(Course).filter(Course.id == course_id).first()

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Course with id {course_id} does not exist.",
        )

    return course


def _get_or_create_enrollment(db: Session, user_id: int, course_id: int) -> Enrollment:
    enrollment = (
        db.query(Enrollment)
        .filter(Enrollment.user_id == user_id, Enrollment.course_id == course_id)
        .first()
    )

    if not enrollment:
        enrollment = Enrollment(
            user_id=user_id,
            course_id=course_id,
            status="enrolled",
        )
        db.add(enrollment)
        db.flush()

    return enrollment


def _get_or_create_progress(db: Session, enrollment_id: int) -> Progress:
    progress = (
        db.query(Progress)
        .filter(Progress.enrollment_id == enrollment_id)
        .first()
    )

    if not progress:
        progress = Progress(
            enrollment_id=enrollment_id,
            completion_percentage=0.0,
            status=STATUS_NOT_STARTED,
        )
        db.add(progress)
        db.flush()

    return progress


def record_course_progress(
    db: Session,
    user_id: int,
    course_id: int,
    progress_percentage: float,
) -> Progress:
    """Record or update a user's progress on a course.

    - Progress percentage must be within 0-100 (enforced by the schema).
    - 100% marks the course completed and stamps ``completed_at``.
    - Existing records are updated rather than duplicated.
    - Each update is appended to ``ProgressHistory``.
    """
    course = _course_or_404(db, course_id)
    now = datetime.now(timezone.utc)

    enrollment = _get_or_create_enrollment(db, user_id, course_id)
    progress = _get_or_create_progress(db, enrollment.id)

    progress.completion_percentage = progress_percentage
    progress.status = status_for_percentage(progress_percentage)
    progress.last_accessed_at = now
    progress.updated_at = now

    if progress.status == STATUS_IN_PROGRESS and progress.started_at is None:
        progress.started_at = now

    if progress.status == STATUS_COMPLETED:
        if progress.started_at is None:
            progress.started_at = now
        progress.completed_at = now

        if enrollment.status != "completed":
            enrollment.status = "completed"

    db.add(progress)

    history = ProgressHistory(
        user_id=user_id,
        course_id=course.id,
        progress_percentage=progress_percentage,
        created_at=now,
    )
    db.add(history)

    db.commit()
    db.refresh(progress)
    return progress


def get_user_progress(db: Session, user_id: int) -> list[dict]:
    """Return all course progress records for the current user."""
    progress_records = (
        db.query(Progress)
        .join(Enrollment, Progress.enrollment_id == Enrollment.id)
        .filter(Enrollment.user_id == user_id)
        .all()
    )

    results = []

    for progress in progress_records:
        results.append(
            {
                "course_id": progress.enrollment.course_id,
                "course_title": progress.enrollment.course.title,
                "progress_percentage": progress.completion_percentage,
                "status": progress.status,
            }
        )

    return results


def get_course_progress(
    db: Session,
    user_id: int,
    course_id: int,
) -> dict | None:
    """Return the current user's progress for a specific course, or None."""
    _course_or_404(db, course_id)

    progress = (
        db.query(Progress)
        .join(Enrollment, Progress.enrollment_id == Enrollment.id)
        .filter(Enrollment.user_id == user_id, Enrollment.course_id == course_id)
        .first()
    )

    if not progress:
        return None

    return {
        "course_id": progress.enrollment.course_id,
        "course_title": progress.enrollment.course.title,
        "progress_percentage": progress.completion_percentage,
        "status": progress.status,
        "started_at": progress.started_at,
        "completed_at": progress.completed_at,
        "last_accessed_at": progress.last_accessed_at,
        "updated_at": progress.updated_at,
    }


def get_progress_summary(db: Session, user_id: int) -> dict:
    """Compute overall learning progress from the user's course records."""
    progress_records = (
        db.query(Progress)
        .join(Enrollment, Progress.enrollment_id == Enrollment.id)
        .filter(Enrollment.user_id == user_id)
        .all()
    )

    total = len(progress_records)
    completed = sum(1 for p in progress_records if p.status == STATUS_COMPLETED)
    in_progress = sum(1 for p in progress_records if p.status == STATUS_IN_PROGRESS)
    # Records with no progress (0%) are counted as not started. Where a user has
    # no progress record for an enrollment yet, it defaults to not_started.
    not_started = sum(1 for p in progress_records if p.status == STATUS_NOT_STARTED)

    # Include enrolled courses that have no progress record yet as not started.
    enrollments = (
        db.query(Enrollment)
        .filter(Enrollment.user_id == user_id)
        .all()
    )

    tracked_course_ids = {p.enrollment.course_id for p in progress_records}
    for enrollment in enrollments:
        if enrollment.course_id not in tracked_course_ids:
            total += 1
            not_started += 1

    overall = 0.0

    if total > 0:
        total_percentage = sum(
            p.completion_percentage for p in progress_records
        )
        overall = round(total_percentage / total, 2)

    return {
        "total_courses": total,
        "completed_courses": completed,
        "in_progress_courses": in_progress,
        "not_started_courses": not_started,
        "overall_progress_percentage": overall,
    }


def get_skill_progress(db: Session, user_id: int) -> list[dict]:
    """Compute skill improvement from the user's assessment results."""
    results = (
        db.query(AssessmentResult)
        .join(
            AssessmentResult.assessment,
        )
        .filter(AssessmentResult.user_id == user_id)
        .order_by(AssessmentResult.submitted_at.asc())
        .all()
    )

    skill_scores: dict[str, list[float]] = {}

    for result in results:
        skill_name = result.assessment.skill.name
        skill_scores.setdefault(skill_name, []).append(result.score)

    skill_progress = []

    for skill, scores in skill_scores.items():
        initial_score = scores[0]
        latest_score = scores[-1]
        improvement = round(latest_score - initial_score, 2)

        skill_progress.append(
            {
                "skill": skill,
                "initial_score": initial_score,
                "latest_score": latest_score,
                "improvement": improvement,
            }
        )

    skill_progress.sort(key=lambda item: item["skill"].lower())
    return skill_progress


def get_progress_history(
    db: Session,
    user_id: int,
) -> list[dict]:
    """Return chronological progress updates for the user."""
    history = (
        db.query(ProgressHistory)
        .filter(ProgressHistory.user_id == user_id)
        .order_by(ProgressHistory.created_at.asc())
        .all()
    )

    return [
        {
            "course_id": item.course_id,
            "progress_percentage": item.progress_percentage,
            "updated_at": item.created_at,
        }
        for item in history
    ]


