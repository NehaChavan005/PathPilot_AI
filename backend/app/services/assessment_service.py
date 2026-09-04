from sqlalchemy.orm import Session
from backend.app.models.assessment import Assessment


def record_assessment(db: Session, user_id: int, topic: str, score: float) -> Assessment:
    item = Assessment(user_id=user_id, topic=topic, score=score)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def get_assessments_for_user(db: Session, user_id: int) -> list[Assessment]:
    return db.query(Assessment).filter_by(user_id=user_id).order_by(Assessment.created_at.desc()).all()
