import math
from typing import Any
from backend.app.ai.skill_extractor import canonicalize_skill
from backend.app.knowledge_graph.ontology import ROLE_SKILL_TAXONOMY, SKILL_METADATA
from backend.app.knowledge_graph.skill_graph import SkillGraph


def simulate_scenario(
    current_role: str,
    simulated_role: str | None = None,
    current_skills: list[str] | None = None,
    current_weekly_hours: int = 10,
    simulated_weekly_hours: int | None = None,
    available_courses: list[dict[str, Any]] | None = None,
    graph: SkillGraph | None = None,
) -> dict[str, Any]:
    """Execute non-destructive hypothetical what-if scenario simulations.
    
    GUARANTEE: This function performs pure in-memory computations and NEVER mutates 
    user profiles, database progress, or active roadmaps.
    """
    current_skills_canonical = {canonicalize_skill(s) for s in (current_skills or [])}
    available_courses = available_courses or []
    if graph is None:
        graph = SkillGraph()

    target_simulated_role = (simulated_role or current_role).strip()
    target_current_role = current_role.strip()
    weekly_hours_now = max(1, current_weekly_hours)
    weekly_hours_sim = max(1, simulated_weekly_hours if simulated_weekly_hours is not None else current_weekly_hours)

    # 1. Fetch skill requirements for both roles
    current_role_data = ROLE_SKILL_TAXONOMY.get(target_current_role, {
        "required": ["Python", "SQL", "Git", "REST API"],
        "recommended": ["Docker"],
    })
    simulated_role_data = ROLE_SKILL_TAXONOMY.get(target_simulated_role, {
        "required": ["Python", "Machine Learning", "Deep Learning", "PyTorch"],
        "recommended": ["MLOps"],
    })

    curr_req_set = set(current_role_data["required"])
    sim_req_set = set(simulated_role_data["required"])

    # 2. Compute Transferable, New, and Unnecessary skills
    # Skills learner already has that carry over to the new role
    transferable_from_learner = list(current_skills_canonical.intersection(sim_req_set))
    # Skills shared between the two roles
    shared_between_roles = list(curr_req_set.intersection(sim_req_set))
    all_transferable = sorted(set(transferable_from_learner + shared_between_roles))

    # Newly required skills the learner must master for the simulated role
    new_required_skills = sorted([s for s in sim_req_set if s not in current_skills_canonical])

    # Skills required for the old role that are NOT required for the new role
    unnecessary_skills = sorted([s for s in curr_req_set if s not in sim_req_set])

    # 3. Compute Readiness Comparison
    curr_ready_skills = [s for s in curr_req_set if s in current_skills_canonical]
    readiness_curr = round((len(curr_ready_skills) / max(1, len(curr_req_set))) * 100.0, 1)

    sim_ready_skills = [s for s in sim_req_set if s in current_skills_canonical]
    readiness_sim = round((len(sim_ready_skills) / max(1, len(sim_req_set))) * 100.0, 1)

    # 4. Learning Time and Hours Estimation
    new_skills_hours = sum(SKILL_METADATA.get(s, {}).get("hours", 30) for s in new_required_skills)
    old_missing_skills = [s for s in curr_req_set if s not in current_skills_canonical]
    old_skills_hours = sum(SKILL_METADATA.get(s, {}).get("hours", 30) for s in old_missing_skills)

    weeks_at_curr_pace = max(1, math.ceil(new_skills_hours / weekly_hours_now))
    weeks_at_sim_pace = max(1, math.ceil(new_skills_hours / weekly_hours_sim))

    # 5. Course Difference
    courses_to_add: list[str] = []
    new_skills_lower = {s.lower() for s in new_required_skills}

    for c in available_courses:
        c_skills = [canonicalize_skill(s).lower() for s in (c.get("skills") or [])]
        c_text = f"{c.get('title', '')} {c.get('description', '')}".lower()
        if any(ns in c_skills or ns in c_text for ns in new_skills_lower):
            courses_to_add.append(c.get("title", ""))

    summary_msg = (
        f"Simulating transition from '{target_current_role}' to '{target_simulated_role}'. "
        f"You have {len(all_transferable)} transferable skills ({', '.join(all_transferable[:3])}). "
        f"You will need to acquire {len(new_required_skills)} new skills ({', '.join(new_required_skills[:3])}). "
        f"At {weekly_hours_sim} hrs/week, estimated time to completion is {weeks_at_sim_pace} weeks "
        f"(compared to {weeks_at_curr_pace} weeks at your current {weekly_hours_now} hrs/week pace)."
    )

    return {
        "is_simulation": True,
        "database_mutated": False,
        "current_role": target_current_role,
        "simulated_role": target_simulated_role,
        "current_weekly_hours": weekly_hours_now,
        "simulated_weekly_hours": weekly_hours_sim,
        "transferable_skills": all_transferable,
        "new_required_skills": new_required_skills,
        "unnecessary_skills": unnecessary_skills,
        "readiness_current": readiness_curr,
        "readiness_simulated": readiness_sim,
        "readiness_delta": round(readiness_sim - readiness_curr, 1),
        "estimated_additional_hours": new_skills_hours,
        "estimated_weeks_at_current_pace": weeks_at_curr_pace,
        "estimated_weeks_at_simulated_pace": weeks_at_sim_pace,
        "weeks_saved": max(0, weeks_at_curr_pace - weeks_at_sim_pace),
        "recommended_new_courses": courses_to_add[:4],
        "summary": summary_msg,
    }
