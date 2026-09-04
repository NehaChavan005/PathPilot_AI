from pydantic import BaseModel, Field


class AssessmentCreate(BaseModel):
    topic: str = Field(min_length=1, max_length=200)
    score: float = Field(ge=0, le=100)


class AssessmentRead(BaseModel):
    id: int
    user_id: int
    topic: str
    score: float
    model_config = {"from_attributes": True}
