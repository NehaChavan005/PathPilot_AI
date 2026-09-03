import json

from sqlalchemy.orm import Session

from app.models.roadmap import LearningPath


def create_roadmap(
    db: Session,
    user_id: int,
    title: str,
    steps: list[str]
) -> LearningPath:

    roadmap = LearningPath(
        user_id=user_id,
        title=title,
        steps_json=json.dumps(steps)
    )

    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)

    return roadmap