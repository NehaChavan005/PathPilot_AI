from pydantic import BaseModel


class ProfileCreate(BaseModel):
    headline: str | None = None
    target_role: str | None = None
    bio: str | None = None


class ProfileRead(ProfileCreate):
    id: int
    user_id: int
    model_config = {"from_attributes": True}
