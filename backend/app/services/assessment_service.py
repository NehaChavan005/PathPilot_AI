from sqlalchemy.orm import Session
from app.models.assessment import Assessment


def record_assessment(db: Session, user_id: int, topic: str, score: float) -> Assessment:
    item = Assessment(user_id=user_id, topic=topic, score=score)
    db.add(item); db.commit(); db.refresh(item)
    return item


