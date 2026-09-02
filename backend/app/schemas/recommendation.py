from pydantic import BaseModel


class RecommendationRead(BaseModel):
    id: int
    user_id: int
    course_id: int | None
    reason: str
    score: float
    model_config = {"from_attributes": True}
