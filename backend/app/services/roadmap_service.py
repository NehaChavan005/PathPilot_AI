import json
from sqlalchemy.orm import Session
from app.models.roadmap import Roadmap


def create_roadmap(db: Session, user_id: int, title: str, steps: list[str]) -> Roadmap:
    roadmap = Roadmap(user_id=user_id, title=title, steps_json=json.dumps(steps))
    db.add(roadmap); db.commit(); db.refresh(roadmap)
    return roadmap
