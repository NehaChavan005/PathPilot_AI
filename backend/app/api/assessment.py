from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.assessment import Assessment
from app.models.user import User
from app.schemas.assessment import AssessmentCreate, AssessmentRead
from app.services.assessment_service import record_assessment
from app.utils.dependencies import current_user

router = APIRouter(prefix="/assessments", tags=["assessments"])


@router.get("", response_model=list[AssessmentRead])
def get_assessments(user: User = Depends(current_user), db: Session = Depends(get_db)):
    return db.query(Assessment).filter_by(user_id=user.id).all()


@router.post("", response_model=AssessmentRead, status_code=status.HTTP_201_CREATED)
def add_assessment(payload: AssessmentCreate, user: User = Depends(current_user), db: Session = Depends(get_db)):
    return record_assessment(db, user.id, payload.topic, payload.score)


