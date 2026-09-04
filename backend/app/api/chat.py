from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from backend.app.ai.chat_service import answer
from backend.app.database.connection import get_db
from backend.app.ai.skill_extractor import assess_skill_gaps, extract_skills
from backend.app.models.profile import LearnerProfile
from backend.app.models.progress import Enrollment, Progress
from backend.app.models.user import User
from backend.app.schemas.ai import ChatContextRequest, ChatResponse
from backend.app.utils.dependencies import current_user

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
def chat(
    payload: ChatContextRequest,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(LearnerProfile).filter_by(user_id=user.id).first()
    target_role = profile.target_role if profile else "Software Engineer"

    current_skills: list[str] = []
    if profile and profile.interests:
        current_skills = extract_skills(profile.interests)

    gap_analysis = assess_skill_gaps(
        current_skills=current_skills,
        target_role=target_role,
    )
    skill_gaps = [g["skill"] for g in gap_analysis.get("skill_gaps", [])]

    progress_records = (
        db.query(Progress)
        .join(Enrollment, Progress.enrollment_id == Enrollment.id)
        .filter(Enrollment.user_id == user.id)
        .all()
    )
    avg_progress = 0.0
    if progress_records:
        avg_progress = sum(p.completion_percentage for p in progress_records) / len(progress_records)

    learner_context = {
        "target_role": target_role,
        "current_skills": current_skills,
        "skill_gaps": skill_gaps,
        "current_milestone": "Foundations",
        "average_progress": round(avg_progress, 1),
    }

    reply = answer(payload.message, user.full_name, learner_context=learner_context)
    return {"reply": reply}
