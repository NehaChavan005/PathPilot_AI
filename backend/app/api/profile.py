from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.profile import Profile
from app.models.user import User
from app.schemas.profile import ProfileCreate, ProfileRead
from app.services.profile_service import upsert_profile
from app.utils.dependencies import current_user

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("/me", response_model=ProfileRead | None)
def get_profile(user: User = Depends(current_user), db: Session = Depends(get_db)):
    return db.query(Profile).filter_by(user_id=user.id).first()


@router.put("/me", response_model=ProfileRead)
def update_profile(payload: ProfileCreate, user: User = Depends(current_user), db: Session = Depends(get_db)):
    return upsert_profile(db, user.id, payload.model_dump())
