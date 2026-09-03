from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.models.user import User
from backend.app.utils.security import hash_password


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
        full_name="PathPilot Developer",
        password_hash=hash_password("dev-only-password"),
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not create development user.",
        )

    return user
