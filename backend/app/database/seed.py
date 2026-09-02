from sqlalchemy.orm import Session
from app.models.skill import Skill


def seed_skills(db: Session) -> None:
    if not db.query(Skill).first():
        db.add_all([Skill(name=name, category="technology") for name in ("Python", "SQL", "Git")])
        db.commit()
