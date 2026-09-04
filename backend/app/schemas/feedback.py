from datetime import datetime

from pydantic import BaseModel, Field


class FeedbackCreate(BaseModel):
    feedback_type: str = Field(..., pattern="^(like|dislike)$")
    course_id: int | None = None
    message: str | None = Field(None, max_length=2000)


class FeedbackRead(BaseModel):
    id: int
    user_id: int
    course_id: int | None = None
    feedback_type: str
    message: str | None = None
    created_at: datetime
    model_config = {"from_attributes": True}
