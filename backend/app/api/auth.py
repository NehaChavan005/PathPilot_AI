from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.auth import LoginRequest, Token, UserCreate, UserRead
from app.services.auth_service import login_user, register_user

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