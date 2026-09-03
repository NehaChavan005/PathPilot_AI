from sqlalchemy.orm import Session

from backend.app.models.profile import LearnerProfile


def upsert_profile(db: Session, user_id: int, values: dict) -> LearnerProfile:

    profile = (
        db.query(LearnerProfile)
        .filter_by(user_id=user_id)
        .first()
        or LearnerProfile(user_id=user_id)
    )

    for key, value in values.items():
        setattr(profile, key, value)

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile
