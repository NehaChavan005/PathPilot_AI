from sqlalchemy.orm import Session
from app.models.progress import Progress


def record_progress(db: Session, user_id: int, course_id: int, percent_complete: float) -> Progress:
    item = db.query(Progress).filter_by(user_id=user_id, course_id=course_id).first() or Progress(user_id=user_id, course_id=course_id)
    item.percent_complete = percent_complete
    db.add(item); db.commit(); db.refresh(item)
    return item
