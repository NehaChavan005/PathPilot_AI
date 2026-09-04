from sqlalchemy.orm import Session

from backend.app.models.feedback import Feedback


def submit_feedback(db: Session, user_id: int, feedback_type: str, course_id: int | None = None, message: str | None = None) -> Feedback:
    fb = Feedback(
        user_id=user_id,
        course_id=course_id,
        feedback_type=feedback_type,
        message=message,
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return fb


def get_feedback_for_user(db: Session, user_id: int) -> list[Feedback]:
    return db.query(Feedback).filter_by(user_id=user_id).order_by(Feedback.created_at.desc()).all()
