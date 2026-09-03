from sqlalchemy.orm import Session
from app.models.recommendation import Recommendation


def recommendations_for_user(db: Session, user_id: int) -> list[Recommendation]:
    return db.query(Recommendation).filter_by(user_id=user_id).order_by(Recommendation.score.desc()).all()


