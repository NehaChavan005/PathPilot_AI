from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from backend.app.database.connection import get_db
from backend.app.models.assessment import Assessment
from backend.app.models.user import User
from backend.app.schemas.assessment import AssessmentCreate, AssessmentRead
from backend.app.services.assessment_service import record_assessment
from backend.app.utils.dependencies import current_user

router = APIRouter(prefix="/assessments", tags=["assessments"])


@router.get("", response_model=list[AssessmentRead])
def get_assessments(user: User = Depends(current_user), db: Session = Depends(get_db)):
    return get_assessments_for_user(db, user.id)


@router.post("", response_model=AssessmentRead, status_code=status.HTTP_201_CREATED)
def add_assessment(payload: AssessmentCreate, user: User = Depends(current_user), db: Session = Depends(get_db)):
    return record_assessment(db, user.id, payload.topic, payload.score)
