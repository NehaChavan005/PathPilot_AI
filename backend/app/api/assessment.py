from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.app.ai.assessment_generator import evaluate_assessment, generate_assessment
from backend.app.database.connection import get_db
from backend.app.models.assessment import Assessment
from backend.app.models.user import User
from backend.app.schemas.ai import (
    AssessmentEvaluateRequest,
    AssessmentEvaluationResponse,
    AssessmentGenerateRequest,
    AssessmentGenerateResponse,
)
from backend.app.schemas.assessment import AssessmentCreate, AssessmentRead
from backend.app.services.assessment_service import get_assessments_for_user, record_assessment
from backend.app.utils.dependencies import current_user

router = APIRouter(prefix="/assessments", tags=["assessments"])


@router.get("", response_model=list[AssessmentRead])
def get_assessments(user: User = Depends(current_user), db: Session = Depends(get_db)):
    return get_assessments_for_user(db, user.id)


@router.post("", response_model=AssessmentRead, status_code=status.HTTP_201_CREATED)
def add_assessment(payload: AssessmentCreate, user: User = Depends(current_user), db: Session = Depends(get_db)):
    return record_assessment(db, user.id, payload.topic, payload.score)


@router.post("/generate", response_model=AssessmentGenerateResponse)
def generate(payload: AssessmentGenerateRequest, user: User = Depends(current_user)):
    result = generate_assessment(
        topic=payload.topic,
        difficulty=payload.difficulty,
        num_questions=payload.num_questions,
    )
    return result


@router.post("/evaluate", response_model=AssessmentEvaluationResponse)
def evaluate(
    payload: AssessmentEvaluateRequest,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    result = evaluate_assessment(
        assessment_id=payload.assessment_id,
        submitted_answers=payload.answers,
    )

    record_assessment(db, user.id, result.get("topic", "General"), result["score"])

    return result
