from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.assessment import Assessment, AssessmentResult
from app.models.user import User
from app.schemas.assessment import AssessmentCreate, AssessmentRead
from app.utils.dependencies import current_user

router = APIRouter(prefix="/assessments", tags=["assessments"])


@router.get("", response_model=list[AssessmentRead])
def get_assessments(user: User = Depends(current_user), db: Session = Depends(get_db)):
    results = (
        db.query(AssessmentResult)
        .filter(AssessmentResult.user_id == user.id)
        .order_by(AssessmentResult.submitted_at.desc())
        .all()
    )
    return [
        {
            "id": r.id,
            "user_id": r.user_id,
            "topic": r.assessment.title,
            "score": r.score,
        }
        for r in results
    ]


@router.post("", response_model=AssessmentRead, status_code=status.HTTP_201_CREATED)
def add_assessment(payload: AssessmentCreate, user: User = Depends(current_user), db: Session = Depends(get_db)):
    assessment = db.query(Assessment).filter(Assessment.title == payload.topic).first()
    if not assessment:
        assessment = Assessment(
            title=payload.topic,
            skill_id=1,
            difficulty="medium",
            questions_json="[]",
        )
        db.add(assessment)
        db.flush()

    result = AssessmentResult(
        user_id=user.id,
        assessment_id=assessment.id,
        score=payload.score,
    )
    db.add(result)
    db.commit()
    db.refresh(result)

    return {
        "id": result.id,
        "user_id": result.user_id,
        "topic": payload.topic,
        "score": result.score,
    }
