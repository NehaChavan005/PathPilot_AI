from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth import UserCreate
from app.utils.security import create_access_token, hash_password, verify_password


def register_user(db: Session, payload: UserCreate) -> User:
    if db.query(User).filter_by(email=payload.email).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    user = User(email=payload.email, full_name=payload.full_name, password_hash=hash_password(payload.password))
    db.add(user); db.commit(); db.refresh(user)
    return user
def login_user(db: Session, email: str, password: str) -> str:
    user = db.query(User).filter_by(email=email).first()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    return access_token



def login_user(db: Session, email: str, password: str) -> str:
    user = db.query(User).filter_by(email=email).first()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={"sub": str(user.id)}
    )

    return access_token
