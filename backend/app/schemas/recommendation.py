from pydantic import BaseModel


class RecommendationRead(BaseModel):
    id: int
    user_id: int
    course_id: int | None = None
    explanation: str | None = None
    final_score: float = 0.0
    model_config = {"from_attributes": True}
