from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.progress import Progress
from app.models.user import User
from app.schemas.progress import ProgressCreate, ProgressRead
from app.services.progress_service import record_progress
from app.utils.dependencies import current_user

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("", response_model=list[ProgressRead])
def get_progress(user: User = Depends(current_user), db: Session = Depends(get_db)):
    return db.query(Progress).filter_by(user_id=user.id).all()


@router.put("", response_model=ProgressRead, status_code=status.HTTP_200_OK)
def update_progress(payload: ProgressCreate, user: User = Depends(current_user), db: Session = Depends(get_db)):
    return record_progress(db, user.id, payload.course_id, payload.percent_complete)
