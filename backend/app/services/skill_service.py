from sqlalchemy.orm import Session
from backend.app.models.skill import Skill


def list_skills(db: Session) -> list[Skill]:
    return db.query(Skill).order_by(Skill.name).all()
