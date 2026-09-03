from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database.connection import get_db
from backend.app.models.assessment import AssessmentResult
from backend.app.models.course import Course
from backend.app.models.progress import Enrollment, Progress
from backend.app.models.user import User
from backend.app.utils.dependencies import current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("")
def dashboard(user: User = Depends(current_user), db: Session = Depends(get_db)):
    enrollments = (
        db.query(Enrollment).filter(Enrollment.user_id == user.id).all()
    )

    course_count = len(enrollments)

    progress_records = (
        db.query(Progress)
        .join(Enrollment, Progress.enrollment_id == Enrollment.id)
        .filter(Enrollment.user_id == user.id)
        .all()
    )

    completed = sum(1 for p in progress_records if p.status == "completed")
    in_progress = sum(1 for p in progress_records if p.status == "in_progress")

    average_progress = 0.0

    if course_count > 0:
        total_percentage = sum(p.completion_percentage for p in progress_records)
        average_progress = total_percentage / course_count

    assessments_taken = (
        db.query(AssessmentResult)
        .filter(AssessmentResult.user_id == user.id)
        .count()
    )

    return {
        "user_id": user.id,
        "courses_enrolled": course_count,
        "courses_completed": completed,
        "courses_in_progress": in_progress,
        "average_progress": average_progress,
        "assessments_taken": assessments_taken,
    }
