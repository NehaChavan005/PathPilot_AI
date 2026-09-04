from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.models.profile import LearnerProfile
from backend.app.models.user import User
from backend.app.services.career_path_service import build_career_path
from backend.app.services.career_service import recommend_career
from backend.app.utils.dependencies import current_user

router = APIRouter(
    prefix="/career",
    tags=["career"]
)


class CareerRequest(BaseModel):
    skills: list[str]
    interests: list[str] = []


class CareerPathRequest(BaseModel):
    career_goal: str
    current_skills: list[str] = []


@router.get("/")
def get_careers():
    from backend.app.knowledge_graph.ontology import ROLE_SKILL_TAXONOMY
    return {
        "careers": [
            {
                "title": role,
                "required_skills": data["required"],
                "recommended_skills": data["recommended"],
            }
            for role, data in ROLE_SKILL_TAXONOMY.items()
        ]
    }


@router.post("/recommend")
def recommend(data: CareerRequest):
    result = recommend_career(data.skills, data.interests)
    return {
        "skills": data.skills,
        "interests": data.interests,
        "recommendations": [result],
    }


@router.post("/path")
def career_path(
    payload: CareerPathRequest,
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    """Return a dynamic skill-flowchart for a given career goal."""
    profile = db.query(LearnerProfile).filter_by(user_id=user.id).first()

    # Merge explicit skills with profile-derived skills
    skills = list(payload.current_skills)
    if profile and profile.interests:
        from backend.app.ai.skill_extractor import extract_skills
        for s in extract_skills(profile.interests):
            if s not in skills:
                skills.append(s)

    # Add skills from profile capabilities (stored as JSON)
    if profile and profile.preferences:
        import json
        try:
            stored = json.loads(profile.preferences)
            caps = stored.get("capabilities", {})
            for sk in caps:
                if sk not in skills:
                    skills.append(sk)
        except Exception:
            pass

    return build_career_path(payload.career_goal, skills)
