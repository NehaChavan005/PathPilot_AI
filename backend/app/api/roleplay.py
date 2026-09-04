from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.ai.roleplay import roleplay_chat, PERSONAS
from backend.app.database.connection import get_db
from backend.app.models.profile import LearnerProfile
from backend.app.models.user import User
from backend.app.utils.dependencies import current_user

router = APIRouter(prefix="/roleplay", tags=["roleplay"])


class RoleplayRequest(BaseModel):
    message: str
    role: str = "technical_interviewer"
    session_id: str | None = None


@router.get("/roles")
def get_roles():
    """Return available roleplay personas."""
    return {
        "roles": [
            {"id": "technical_interviewer", "label": "Technical Interview", "description": "Practice technical questions"},
            {"id": "hr_interviewer", "label": "HR Interview", "description": "Behavioral & situational questions"},
            {"id": "career_mentor", "label": "Career Mentor", "description": "Personalized career guidance"},
            {"id": "skill_assessor", "label": "Skill Assessment", "description": "Verify your knowledge level"},
        ]
    }


@router.post("/chat")
def chat(
    payload: RoleplayRequest,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    """Process a roleplay chat message with conversation memory."""
    profile = db.query(LearnerProfile).filter_by(user_id=user.id).first()
    career = profile.target_role if profile else "Software Engineer"
    level = "Beginner"
    if profile and profile.experience_level:
        level = profile.experience_level.title()
    elif profile and profile.preferences:
        import json
        try:
            stored = json.loads(profile.preferences)
            level = stored.get("experienceLevel", "Beginner")
        except Exception:
            pass

    # Extract skills from profile
    skills = []
    if profile and profile.interests:
        from backend.app.ai.skill_extractor import extract_skills
        skills = extract_skills(profile.interests)
    if profile and profile.preferences:
        import json
        try:
            stored = json.loads(profile.preferences)
            caps = stored.get("capabilities", {})
            if caps:
                skills = list(caps.keys())
        except Exception:
            pass

    result = roleplay_chat(
        message=payload.message,
        role=payload.role,
        career=career,
        level=level,
        skills=skills[:10],
        session_id=payload.session_id,
    )
    return result
