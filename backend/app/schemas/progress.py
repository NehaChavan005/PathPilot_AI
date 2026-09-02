from pydantic import BaseModel, Field


class ProgressCreate(BaseModel):
    course_id: int
    percent_complete: float = Field(ge=0, le=100)


class ProgressRead(ProgressCreate):
    id: int
    user_id: int
    model_config = {"from_attributes": True}
