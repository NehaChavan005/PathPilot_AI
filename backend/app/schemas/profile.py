from pydantic import BaseModel, Field


class ProfileCreate(BaseModel):
    target_role: str | None = None
    experience_level: str | None = None
    education: str | None = None
    interests: str | None = None
    preferences: str | None = None
    weekly_hours: int | None = Field(default=None, ge=0)


class ProfileRead(ProfileCreate):
    id: int
    user_id: int
    model_config = {"from_attributes": True}
