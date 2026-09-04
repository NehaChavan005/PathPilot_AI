from typing import Any
from sqlalchemy.orm import Session
from backend.app.models.progress import Enrollment, Progress


def collaborative_score(user_id: int, course_id: int, db: Session | None = None) -> float:
    """Calculate collaborative filtering score based on peer completions and peer progress similarity."""
    if db is None:
        # Heuristic prior for cold-start when DB session is not passed
        return 0.65

    try:
        # 1. Fetch peer learners who interacted with this course
        peer_progress = (
            db.query(Progress)
            .join(Enrollment, Progress.enrollment_id == Enrollment.id)
            .filter(Enrollment.course_id == course_id, Enrollment.user_id != user_id)
            .all()
        )

        if not peer_progress:
            # Cold-start fallback prior
            return 0.60

        # 2. Peer completion rate / popularity signal
        total_peers = len(peer_progress)
        avg_completion = sum(p.completion_percentage for p in peer_progress) / (total_peers * 100.0)
        popularity_signal = min(1.0, total_peers / 5.0)

        # 3. User-user overlap similarity
        # Find courses the current user is active in
        user_enrollments = db.query(Enrollment).filter(Enrollment.user_id == user_id).all()
        user_courses = {e.course_id for e in user_enrollments}

        if not user_courses:
            return round(0.5 * avg_completion + 0.5 * popularity_signal, 3)

        # Check how many peers in this course share other courses with the target user
        peer_user_ids = {e.user_id for e in peer_progress}
        shared_enrollments = (
            db.query(Enrollment)
            .filter(Enrollment.user_id.in_(peer_user_ids), Enrollment.course_id.in_(user_courses))
            .count()
        )

        jaccard_overlap = min(1.0, shared_enrollments / (len(user_courses) * len(peer_user_ids) + 1e-5))

        final_score = (0.4 * avg_completion) + (0.3 * popularity_signal) + (0.3 * jaccard_overlap)
        return round(min(1.0, max(0.1, final_score)), 3)

    except Exception:
        return 0.60


def get_collaborative_scores(
    user_id: int,
    course_ids: list[int],
    db: Session | None = None,
) -> dict[int, float]:
    """Batch compute collaborative filtering scores for multiple courses."""
    return {cid: collaborative_score(user_id, cid, db) for cid in course_ids}
