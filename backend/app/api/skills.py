from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.skill import Skill
from app.schemas.skill import SkillCreate, SkillRead
from app.services.skill_service import list_skills

router = APIRouter(prefix="/skills", tags=["skills"])


@router.get("", response_model=list[SkillRead])
def get_skills(db: Session = Depends(get_db)):
    return list_skills(db)


@router.post("", response_model=SkillRead, status_code=status.HTTP_201_CREATED)
def create_skill(payload: SkillCreate, db: Session = Depends(get_db)):
    skill = Skill(**payload.model_dump())
    db.add(skill); db.commit(); db.refresh(skill)
    return skill
