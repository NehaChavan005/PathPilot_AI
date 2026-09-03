from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.skill import Prerequisite, Skill
from app.schemas.skill import (
    GraphNodeData,
    GraphNodePosition,
    SkillGraphEdge,
    SkillGraphNode,
    SkillGraphResponse,
)

# Node positions for the graph layout.
NODE_WIDTH = 220
NODE_HEIGHT = 70
HORIZONTAL_SPACING = 60
VERTICAL_SPACING = 120

# Optional filter to keep only the prerequisites/skills relevant to a career.
CAREER_SKILLS: dict[str, set[str]] = {
    "machine learning engineer": {
        "Python",
        "NumPy",
        "Pandas",
        "Statistics",
        "Machine Learning",
        "Deep Learning",
        "Scikit-learn",
        "TensorFlow",
        "PyTorch",
        "Computer Vision",
        "NLP",
        "Data Analysis",
        "Feature Engineering",
        "Model Evaluation",
    },
    "data scientist": {
        "Python",
        "SQL",
        "Statistics",
        "NumPy",
        "Pandas",
        "Data Analysis",
        "Machine Learning",
        "Scikit-learn",
        "Data Structures",
        "Git",
    },
    "cybersecurity analyst": {
        "Networking",
        "Linux",
        "Cybersecurity",
        "Network Security",
        "SIEM",
        "Splunk",
        "Cloud Security",
        "AWS",
        "Azure",
    },
    "software developer": {
        "Python",
        "JavaScript",
        "TypeScript",
        "React",
        "FastAPI",
        "Flask",
        "REST APIs",
        "HTML/CSS",
        "Git",
        "SQL",
        "Docker",
    },
    "devops engineer": {
        "Linux",
        "Git",
        "Docker",
        "Kubernetes",
        "AWS",
        "Azure",
        "DevOps",
        "Python",
    },
}


def _normalize(career: str) -> str:
    return career.strip().lower()


def _build_id(skill_name: str) -> str:
    return skill_name.strip().lower().replace(" ", "-").replace("/", "-")


def _position(index: int, column: int) -> GraphNodePosition:
    return GraphNodePosition(
        x=column * (NODE_WIDTH + HORIZONTAL_SPACING),
        y=index * (NODE_HEIGHT + VERTICAL_SPACING),
    )


def _build_graph(
    skills: list[Skill],
    prerequisites: list[Prerequisite],
) -> SkillGraphResponse:
    """Build a React Flow-compatible graph from skills and prerequisite edges."""
    skill_by_id: dict[str, Skill] = {
        _build_id(skill.name): skill for skill in skills
    }

    # ── Topological levels (deterministic layout) ──
    # Level 0 = skills with no prerequisites (root nodes).
    prereq_map: dict[str, set[str]] = {}
    for prereq in prerequisites:
        target = _build_id(prereq.skill.name)
        source = _build_id(prereq.prerequisite_skill.name)

        if target not in prereq_map:
            prereq_map[target] = set()

        prereq_map[target].add(source)

    levels: dict[str, int] = {}

    def assign_level(skill_id: str) -> int:
        if skill_id in levels:
            return levels[skill_id]

        deps = prereq_map.get(skill_id, set())
        level = 0

        if deps:
            level = max(assign_level(dep) for dep in deps) + 1

        levels[skill_id] = level
        return level

    for skill_id in skill_by_id:
        assign_level(skill_id)

    # ── Order nodes within each level by name for readability ──
    level_nodes: dict[int, list[str]] = {}
    for skill_id in skill_by_id:
        level_nodes.setdefault(levels[skill_id], []).append(skill_id)

    for level in level_nodes:
        level_nodes[level].sort()

    nodes: list[SkillGraphNode] = []
    for level, ids in sorted(level_nodes.items()):
        for index, skill_id in enumerate(ids):
            skill = skill_by_id[skill_id]
            nodes.append(
                SkillGraphNode(
                    id=skill_id,
                    type="skill",
                    data=GraphNodeData(label=skill.name),
                    position=_position(index, level),
                )
            )

    # ── Edges (deduplicated) ──
    seen_edges: set[tuple[str, str]] = set()
    edges: list[SkillGraphEdge] = []

    for prereq in prerequisites:
        source = _build_id(prereq.prerequisite_skill.name)
        target = _build_id(prereq.skill.name)

        if (source, target) in seen_edges:
            continue

        seen_edges.add((source, target))
        edges.append(
            SkillGraphEdge(
                id=f"{source}-{target}",
                source=source,
                target=target,
                type="smoothstep",
            )
        )

    nodes.sort(key=lambda n: (n.position.y, n.position.x))

    return SkillGraphResponse(nodes=nodes, edges=edges)


def build_skill_graph(db: Session, career: str | None = None) -> SkillGraphResponse:
    """Build the full skill graph, optionally filtered by a target career.

    Args:
        db: Active database session.
        career: Optional target career name (case-insensitive). If provided,
            only skills and their prerequisites relevant to that career are
            included. Returns an empty graph for an unknown career.
    """
    skills = db.query(Skill).order_by(Skill.name).all()

    if career:
        normalized = _normalize(career)

        if normalized not in CAREER_SKILLS:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    f"Unknown career: '{career}'. "
                    f"Choose from: {', '.join(sorted(CAREER_SKILLS))}"
                ),
            )

        allowed = CAREER_SKILLS[normalized]
        skills = [skill for skill in skills if skill.name in allowed]

    skill_ids = {skill.id for skill in skills}
    prerequisites = (
        db.query(Prerequisite)
        .filter(
            Prerequisite.skill_id.in_(skill_ids) | Prerequisite.prerequisite_skill_id.in_(skill_ids)
        )
        .all()
    )

    # Keep only edges whose endpoints are within the filtered skill set.
    prerequisites = [
        prereq
        for prereq in prerequisites
        if prereq.skill_id in skill_ids and prereq.prerequisite_skill_id in skill_ids
    ]

    return _build_graph(skills, prerequisites)

