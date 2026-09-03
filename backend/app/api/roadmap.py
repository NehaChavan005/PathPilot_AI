import json

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.models.roadmap import LearningPath
from backend.app.models.user import User
from backend.app.schemas.roadmap import RoadmapCreate, RoadmapRead
from backend.app.services.roadmap_service import create_roadmap
from backend.app.utils.dependencies import current_user


router = APIRouter(
    prefix="/roadmaps",
    tags=["roadmaps"]
)


def serialize(item: LearningPath) -> dict:
    return {
        "id": item.id,
        "user_id": item.user_id,
        "title": item.title,
        "steps": json.loads(item.steps_json)
    }


@router.get(
    "",
    response_model=list[RoadmapRead]
)
def get_roadmaps(
    user: User = Depends(current_user),
    db: Session = Depends(get_db)
):
    roadmaps = (
        db.query(LearningPath)
        .filter_by(user_id=user.id)
        .all()
    )

    return [serialize(item) for item in roadmaps]


@router.post(
    "",
    response_model=RoadmapRead,
    status_code=status.HTTP_201_CREATED
)
def add_roadmap(
    payload: RoadmapCreate,
    user: User = Depends(current_user),
    db: Session = Depends(get_db)
):
    roadmap = create_roadmap(
        db,
        user.id,
        payload.title,
        payload.steps
    )

    return serialize(roadmap)
