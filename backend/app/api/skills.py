from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.models.skill import Skill
from backend.app.schemas.skill import SkillCreate, SkillRead, SkillGraphResponse
from backend.app.services.skill_graph_service import build_skill_graph
from backend.app.services.skill_service import list_skills

router = APIRouter(prefix="/skills", tags=["skills"])


@router.get("", response_model=list[SkillRead])
def get_skills(db: Session = Depends(get_db)):
    return list_skills(db)


@router.post("", response_model=SkillRead, status_code=status.HTTP_201_CREATED)
def create_skill(payload: SkillCreate, db: Session = Depends(get_db)):
    skill = Skill(**payload.model_dump())
    db.add(skill); db.commit(); db.refresh(skill)
    return skill


@router.get("/graph", response_model=SkillGraphResponse)
def get_skill_graph(
    career: str | None = Query(default=None, description="Target career filter (case-insensitive)"),
    db: Session = Depends(get_db),
):
    """Return a React Flow-compatible skill graph.

    Optionally filter by target career, e.g.
    ``GET /api/skills/graph?career=Machine Learning Engineer``.
    """
    return build_skill_graph(db, career=career)
