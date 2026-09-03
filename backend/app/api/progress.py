from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.models.user import User
from backend.app.schemas.progress import (
    CourseProgressRead,
    ProgressCreate,
    ProgressHistoryItem,
    ProgressRead,
    ProgressSummary,
    SkillProgress,
)
from backend.app.services import progress_service
from backend.app.utils.dependencies import current_user

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("", response_model=list[CourseProgressRead])
def get_progress(
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    return progress_service.get_user_progress(db, user.id)


@router.post("", response_model=ProgressRead, status_code=status.HTTP_201_CREATED)
def record_or_update_progress(
    payload: ProgressCreate,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    progress = progress_service.record_course_progress(
        db,
        user.id,
        payload.course_id,
        payload.progress_percentage,
    )

    return progress_service.get_course_progress(db, user.id, payload.course_id)


@router.get("/summary", response_model=ProgressSummary)
def progress_summary(
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    return progress_service.get_progress_summary(db, user.id)


@router.get("/skills", response_model=list[SkillProgress])
def skill_progress(
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    return progress_service.get_skill_progress(db, user.id)


@router.get("/history", response_model=list[ProgressHistoryItem])
def progress_history(
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    return progress_service.get_progress_history(db, user.id)


@router.get("/{course_id}", response_model=ProgressRead | None)
def get_course_progress(
    course_id: int,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    return progress_service.get_course_progress(db, user.id, course_id)
