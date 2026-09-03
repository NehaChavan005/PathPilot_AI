from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.models.profile import LearnerProfile
from backend.app.models.user import User
from backend.app.schemas.profile import ProfileCreate, ProfileRead
from backend.app.services.profile_service import upsert_profile
from backend.app.utils.dependencies import current_user


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
        values=profile_data.model_dump()
    )
