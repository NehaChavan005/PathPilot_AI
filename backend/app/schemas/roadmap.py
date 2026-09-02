from pydantic import BaseModel


class RoadmapCreate(BaseModel):
    title: str
    steps: list[str] = []


class RoadmapRead(RoadmapCreate):
    id: int
    user_id: int
