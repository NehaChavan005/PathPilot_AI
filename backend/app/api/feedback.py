from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.models.user import User
from backend.app.schemas.feedback import FeedbackCreate, FeedbackRead
from backend.app.services.feedback_service import get_feedback_for_user, submit_feedback
from backend.app.utils.dependencies import current_user

router = APIRouter(prefix="/feedback", tags=["feedback"])


@router.get("", response_model=list[FeedbackRead])
def list_feedback(user: User = Depends(current_user), db: Session = Depends(get_db)):
    return get_feedback_for_user(db, user.id)


@router.post("", response_model=FeedbackRead, status_code=status.HTTP_201_CREATED)
def submit(payload: FeedbackCreate, user: User = Depends(current_user), db: Session = Depends(get_db)):
    return submit_feedback(
        db,
        user_id=user.id,
        feedback_type=payload.feedback_type,
        course_id=payload.course_id,
        message=payload.message,
    )
