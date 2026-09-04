import math
from typing import Any
from backend.app.ai.skill_extractor import assess_skill_gaps, canonicalize_skill
from backend.app.knowledge_graph.ontology import ROLE_SKILL_TAXONOMY, SKILL_METADATA
from backend.app.knowledge_graph.skill_graph import SkillGraph


def generate_personalized_roadmap(
    target_role: str,
    current_skills: list[str] | None = None,
    available_courses: list[dict[str, Any]] | None = None,
    weekly_study_hours: int = 10,
    graph: SkillGraph | None = None,
) -> dict[str, Any]:
    """Generate a logically sequenced, prerequisite-aware personalized learning roadmap."""
    current_skills = current_skills or []
    available_courses = available_courses or []
    if graph is None:
        graph = SkillGraph.from_prerequisite_edges()

    weekly_study_hours = max(2, weekly_study_hours)

    # 1. Identify all skill gaps and prerequisites
    gap_analysis = assess_skill_gaps(
        current_skills=current_skills,
        target_role=target_role,
        graph=graph,
    )

    unmet_skills: list[str] = []
    for gap_item in gap_analysis["skill_gaps"]:
        unmet_skills.append(gap_item["skill"])

    if not unmet_skills:
        # Learner already has all core skills
        unmet_skills = ROLE_SKILL_TAXONOMY.get(target_role, {}).get("recommended", ["System Design", "Cloud Computing"])

    # 2. Sequence missing skills using topological sort on the prerequisite DAG
    ordered_skills = graph.topological_sort_skills(unmet_skills)

    # 3. Partition ordered skills into 3-4 structured learning milestones
    # Phase 1: Foundations & Prerequisites (depth 0-1)
    # Phase 2: Core Domain Skills (depth 1-2)
    # Phase 3: Advanced & Production Specializations (depth 3+)
    phase1_skills: list[str] = []
    phase2_skills: list[str] = []
    phase3_skills: list[str] = []

    for skill in ordered_skills:
        depth = graph.get_skill_depth(skill)
        if depth <= 1 and len(phase1_skills) < 4:
            phase1_skills.append(skill)
        elif depth <= 3 and len(phase2_skills) < 4:
            phase2_skills.append(skill)
        else:
            phase3_skills.append(skill)

    # Balance phases if any are empty
    if not phase1_skills and ordered_skills:
        phase1_skills = ordered_skills[:2]
        ordered_skills = ordered_skills[2:]
    if not phase2_skills and ordered_skills:
        phase2_skills = ordered_skills[:3]
        phase3_skills = ordered_skills[3:]

    phases_raw = [
        ("Phase 1: Foundations & Core Prerequisites", phase1_skills, "Foundations"),
        ("Phase 2: Core Role Competencies", phase2_skills, "Intermediate"),
        ("Phase 3: Advanced Architecture & Production Systems", phase3_skills, "Advanced"),
    ]

    milestones: list[dict[str, Any]] = []
    text_steps: list[str] = []
    total_hours = 0
    current_milestone_flagged = False

    for idx, (title, skills_in_phase, level) in enumerate(phases_raw, start=1):
        if not skills_in_phase:
            continue

        phase_hours = sum(SKILL_METADATA.get(s, {}).get("hours", 25) for s in skills_in_phase)
        total_hours += phase_hours
        phase_weeks = max(1, math.ceil(phase_hours / weekly_study_hours))

        # Match relevant courses from available catalog
        matched_courses: list[dict[str, Any]] = []
        phase_skill_set = {s.lower() for s in skills_in_phase}

        for c in available_courses:
            c_skills = {canonicalize_skill(s).lower() for s in (c.get("skills") or [])}
            c_text = f"{c.get('title', '')} {c.get('description', '')}".lower()
            if any(ps in c_skills or ps in c_text for ps in phase_skill_set):
                matched_courses.append({
                    "id": c.get("id"),
                    "title": c.get("title"),
                    "provider": c.get("provider", "PathPilot AI"),
                    "url": c.get("url"),
                })

        # Milestone status
        if not current_milestone_flagged:
            status = "in_progress"
            current_milestone_flagged = True
        else:
            status = "locked"

        step_summary = f"{title}: Master {', '.join(skills_in_phase)} (~{phase_weeks} weeks)"
        text_steps.append(step_summary)

        milestones.append({
            "milestone_number": idx,
            "title": title,
            "level": level,
            "target_skills": skills_in_phase,
            "estimated_hours": phase_hours,
            "estimated_weeks": phase_weeks,
            "status": status,
            "recommended_courses": matched_courses[:3],
        })

    total_weeks = max(1, math.ceil(total_hours / weekly_study_hours))

    return {
        "title": f"Personalized {target_role} Roadmap",
        "target_role": target_role,
        "weekly_study_hours": weekly_study_hours,
        "estimated_total_hours": total_hours,
        "estimated_total_weeks": total_weeks,
        "readiness_score": gap_analysis["readiness_score"],
        "milestones": milestones,
        "steps": text_steps,
    }
