from pydantic import BaseModel, Field


class AssessmentCreate(BaseModel):
    topic: str
    score: float = Field(ge=0, le=100)


class AssessmentRead(AssessmentCreate):
    id: int
    user_id: int
    model_config = {"from_attributes": True}
