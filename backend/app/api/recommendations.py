from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User
from app.schemas.recommendation import RecommendationRead
from app.services.recommendation_service import recommendations_for_user
from app.utils.dependencies import current_user

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.get("", response_model=list[RecommendationRead])
def get_recommendations(user: User = Depends(current_user), db: Session = Depends(get_db)):
    return recommendations_for_user(db, user.id)


