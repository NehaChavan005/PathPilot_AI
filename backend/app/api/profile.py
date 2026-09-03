from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.profile import LearnerProfile
from app.models.user import User
from app.schemas.profile import ProfileCreate, ProfileRead
from app.services.profile_service import upsert_profile
from app.utils.dependencies import current_user


router = APIRouter(
    prefix="/profile",
    tags=["profile"]
)


@router.get("/me", response_model=ProfileRead | None)
def get_profile(
    db: Session = Depends(get_db),
    user: User = Depends(current_user)
):
    return (
        db.query(LearnerProfile)
        .filter(LearnerProfile.user_id == user.id)
        .first()
    )


@router.post("/me", response_model=ProfileRead)
def create_or_update_profile(
    profile_data: ProfileCreate,
    db: Session = Depends(get_db),
    user: User = Depends(current_user)
):
    return upsert_profile(
        db=db,
        user_id=user.id,
        profile_data=profile_data
    )