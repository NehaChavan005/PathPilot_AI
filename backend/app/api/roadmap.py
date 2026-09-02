import json
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.roadmap import Roadmap
from app.models.user import User
from app.schemas.roadmap import RoadmapCreate, RoadmapRead
from app.services.roadmap_service import create_roadmap
from app.utils.dependencies import current_user

router = APIRouter(prefix="/roadmaps", tags=["roadmaps"])


def serialize(item: Roadmap) -> dict:
    return {"id": item.id, "user_id": item.user_id, "title": item.title, "steps": json.loads(item.steps_json)}


@router.get("", response_model=list[RoadmapRead])
def get_roadmaps(user: User = Depends(current_user), db: Session = Depends(get_db)):
    return [serialize(item) for item in db.query(Roadmap).filter_by(user_id=user.id).all()]


@router.post("", response_model=RoadmapRead, status_code=status.HTTP_201_CREATED)
def add_roadmap(payload: RoadmapCreate, user: User = Depends(current_user), db: Session = Depends(get_db)):
    return serialize(create_roadmap(db, user.id, payload.title, payload.steps))
