from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User


def current_user(
    db: Session = Depends(get_db)
):
    """
    Temporary development user.

    JWT authentication is intentionally disabled for now.
    """

    user = db.query(User).first()

    if user:
        return user

    user = User(
        email="dev@pathpilot.local",
        name="PathPilot Developer"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user