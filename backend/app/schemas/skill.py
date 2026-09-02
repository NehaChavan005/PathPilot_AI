from pydantic import BaseModel


class SkillCreate(BaseModel):
    name: str
    category: str | None = None


class SkillRead(SkillCreate):
    id: int
    model_config = {"from_attributes": True}
