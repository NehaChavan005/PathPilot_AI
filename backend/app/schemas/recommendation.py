from pydantic import BaseModel


class RecommendationRead(BaseModel):
    id: int
    user_id: int
    course_id: int | None = None
    reason: str | None = None
    final_score: float
    model_config = {"from_attributes": True}
