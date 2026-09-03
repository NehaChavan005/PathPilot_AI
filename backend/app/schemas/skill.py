from pydantic import BaseModel


class SkillCreate(BaseModel):
    name: str
    category: str | None = None


class SkillRead(SkillCreate):
    id: int
    model_config = {"from_attributes": True}


# ──────────────────────────────────────────────
# Skill Graph schemas (React Flow compatible)
# ──────────────────────────────────────────────


class GraphNodePosition(BaseModel):
    x: float
    y: float


class GraphNodeData(BaseModel):
    label: str


class SkillGraphNode(BaseModel):
    id: str
    type: str = "skill"
    data: GraphNodeData
    position: GraphNodePosition


class SkillGraphEdge(BaseModel):
    id: str
    source: str
    target: str
    type: str = "smoothstep"


class SkillGraphResponse(BaseModel):
    nodes: list[SkillGraphNode]
    edges: list[SkillGraphEdge]
