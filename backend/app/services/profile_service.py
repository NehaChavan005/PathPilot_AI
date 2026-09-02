from sqlalchemy.orm import Session
from app.models.profile import Profile


def upsert_profile(db: Session, user_id: int, values: dict) -> Profile:
    profile = db.query(Profile).filter_by(user_id=user_id).first() or Profile(user_id=user_id)
    for key, value in values.items(): setattr(profile, key, value)
    db.add(profile); db.commit(); db.refresh(profile)
    return profile
