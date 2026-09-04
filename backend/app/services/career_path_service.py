"""Build a dynamic career-path skill flowchart from the ontology."""

from typing import Any
from backend.app.ai.skill_extractor import canonicalize_skill
from backend.app.knowledge_graph.ontology import PREREQUISITE_EDGES, ROLE_SKILL_TAXONOMY, SKILL_METADATA
from backend.app.knowledge_graph.skill_graph import SkillGraph


def build_career_path(
    career_goal: str,
    current_skills: list[str] | None = None,
) -> dict[str, Any]:
    """Generate nodes and edges for a career-path flowchart.

    The graph represents the prerequisite chain of skills needed for
    *career_goal*, with each node annotated with the learner's
    completion status (completed / in_progress / locked).

    Returns a dict with keys ``career``, ``nodes``, ``edges``.
    """
    current_skills = current_skills or []
    canonical_current = {canonicalize_skill(s).lower() for s in current_skills}

    graph = SkillGraph.from_prerequisite_edges()

    # ── Resolve the career's required + recommended skill set ──
    role_key = None
    for name in ROLE_SKILL_TAXONOMY:
        if name.lower() == career_goal.strip().lower():
            role_key = name
            break

    if role_key is None:
        # Fallback: treat career_goal as a literal skill list is not possible,
        # so default to general programming path.
        role_key = "Full Stack Developer"

    role_data = ROLE_SKILL_TAXONOMY[role_key]
    required = role_data["required"]
    recommended = role_data.get("recommended", [])

    # All skills that belong to this career path (required + recommended
    # plus their transitive prerequisites from the ontology).
    all_path_skills: set[str] = set(required)
    for skill in list(required) + list(recommended):
        prereqs = graph.prerequisites_for(skill)
        all_path_skills.update(prereqs)

    # Filter to skills that exist in our ontology metadata so we have
    # difficulty/hours info.
    path_skills = [s for s in all_path_skills if s in SKILL_METADATA or s in required]

    # Also include recommended skills that have metadata
    for s in recommended:
        if s in SKILL_METADATA and s not in path_skills:
            path_skills.append(s)

    # ── Topological sort to get correct order ──
    ordered = graph.topological_sort_skills(path_skills)

    # ── Determine status for each node ──
    nodes: list[dict[str, Any]] = []
    skill_set_for_check = {s.lower() for s in current_skills}
    last_completed_idx = -1

    for idx, skill_name in enumerate(ordered):
        meta = SKILL_METADATA.get(skill_name, {})
        is_completed = skill_name.lower() in skill_set_for_check

        if is_completed:
            status = "completed"
            last_completed_idx = idx
        elif idx == last_completed_idx + 1:
            # The skill immediately after the last completed one is "in_progress"
            status = "in_progress"
        else:
            status = "locked"

        nodes.append({
            "id": skill_name.lower().replace(" ", "-").replace("/", "-"),
            "title": skill_name,
            "status": status,
            "difficulty": meta.get("difficulty", "Intermediate"),
            "hours": meta.get("hours", 25),
            "category": meta.get("category", "general"),
            "required": skill_name in required,
        })

    # ── Build edges from prerequisite graph ──
    node_ids = {n["id"] for n in nodes}
    edges: list[dict[str, str]] = []
    seen: set[tuple[str, str]] = set()

    for prereq_name, skill_name in PREREQUISITE_EDGES:
        src_id = prereq_name.lower().replace(" ", "-").replace("/", "-")
        tgt_id = skill_name.lower().replace(" ", "-").replace("/", "-")
        if src_id in node_ids and tgt_id in node_ids and (src_id, tgt_id) not in seen:
            seen.add((src_id, tgt_id))
            edges.append({"from": src_id, "to": tgt_id})

    # Sort nodes topologically for rendering
    nodes.sort(key=lambda n: (
        {"completed": 0, "in_progress": 1, "locked": 2}[n["status"]],
        n["difficulty"] != "Beginner",
        n["difficulty"] != "Intermediate",
    ))

    return {
        "career": role_key,
        "nodes": nodes,
        "edges": edges,
    }
