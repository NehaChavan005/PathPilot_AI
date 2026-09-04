from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.models.user import User
from backend.app.schemas.auth import LoginRequest, Token, UserCreate, UserRead
from backend.app.services.auth_service import login_user, register_user
from backend.app.utils.dependencies import current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead)
def register(
    payload: UserCreate,
    db: Session = Depends(get_db)
):
    return register_user(db, payload)


@router.post("/login", response_model=Token)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db)
):
    access_token = login_user(
        db,
        payload.email,
        payload.password
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/status")
def auth_status():
    return {
        "authentication": "JWT enabled",
        "message": "JWT authentication is active."
    }


@router.get("/me", response_model=UserRead)
def auth_me(user: User = Depends(current_user)):
    """Return the currently authenticated user."""
    return user
