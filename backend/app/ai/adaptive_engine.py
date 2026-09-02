from typing import Any
from app.ai.skill_extractor import canonicalize_skill
from app.knowledge_graph.skill_graph import SkillGraph


def recalibrate_learning_path(
    user_id: int,
    target_role: str,
    assessment_score: float,
    topic: str,
    current_skills: list[str] | None = None,
    completed_course_ids: set[int] | None = None,
    available_courses: list[dict[str, Any]] | None = None,
    graph: SkillGraph | None = None,
) -> dict[str, Any]:
    """Dynamically adapt recommendations and roadmap pacing based on learner assessment performance."""
    current_skills = current_skills or []
    completed_ids = completed_course_ids or set()
    available_courses = available_courses or []
    if graph is None:
        graph = SkillGraph()

    canonical_topic = canonicalize_skill(topic)
    remedial_skills: list[str] = []
    unlocked_skills: list[str] = []
    recommended_courses: list[dict[str, Any]] = []

    if assessment_score < 60.0:
        # 1. POOR PERFORMANCE (<60%): Inject remedial foundational content and lower difficulty
        action = "remediation"
        status = "needs_improvement"

        # Find foundational ancestors that need reinforcement
        ancestors = graph.prerequisites_for(canonical_topic)
        remedial_skills = [canonical_topic] + ancestors[:2]

        guidance = (
            f"Assessment score of {assessment_score}% on {canonical_topic} indicates foundational misconceptions. "
            f"Your roadmap has been adapted to inject remedial refresher modules on {', '.join(remedial_skills)}. "
            f"We recommend reviewing these introductory resources before proceeding to advanced applications."
        )

        # Filter beginner/remedial courses covering these topics (excluding completed courses)
        for c in available_courses:
            if c.get("id") in completed_ids:
                continue
            c_skills = [canonicalize_skill(s).lower() for s in (c.get("skills") or [])]
            c_text = f"{c.get('title', '')} {c.get('description', '')}".lower()
            if any(rs.lower() in c_skills or rs.lower() in c_text for rs in remedial_skills):
                if c.get("difficulty", "Beginner").lower() in ["beginner", "intermediate"]:
                    recommended_courses.append({
                        "id": c.get("id"),
                        "title": c.get("title"),
                        "difficulty": c.get("difficulty", "Beginner"),
                        "adaptation_reason": f"Remedial support for {canonical_topic}",
                    })

    elif assessment_score >= 80.0:
        # 2. HIGH PERFORMANCE (>=80%): Accelerate pace and unlock next-level skills
        action = "acceleration"
        status = "mastered"

        # Unlock dependent skills in the prerequisite graph
        unlocked_skills = graph.subsequent_skills_for(canonical_topic)
        if not unlocked_skills:
            unlocked_skills = ["Advanced Project Implementation", "System Optimization"]

        guidance = (
            f"Outstanding score of {assessment_score}%! You have demonstrated high mastery of {canonical_topic}. "
            f"Your learning path has been accelerated to unlock higher-tier competencies: {', '.join(unlocked_skills[:3])}."
        )

        # Find next-level courses covering newly unlocked skills
        for c in available_courses:
            if c.get("id") in completed_ids:
                continue
            c_skills = [canonicalize_skill(s).lower() for s in (c.get("skills") or [])]
            c_text = f"{c.get('title', '')} {c.get('description', '')}".lower()
            if any(us.lower() in c_skills or us.lower() in c_text for us in unlocked_skills):
                recommended_courses.append({
                    "id": c.get("id"),
                    "title": c.get("title"),
                    "difficulty": c.get("difficulty", "Advanced"),
                    "adaptation_reason": f"Next-level challenge unlocked by {canonical_topic} mastery",
                })

    else:
        # 3. MODERATE PERFORMANCE (60% - 79%): Consolidate current level
        action = "consolidation"
        status = "proficient"
        guidance = (
            f"Solid performance ({assessment_score}%). You meet the passing threshold for {canonical_topic}. "
            f"Continue with your current scheduled milestone to consolidate these concepts through hands-on practice."
        )

    return {
        "action": action,
        "topic": canonical_topic,
        "score": assessment_score,
        "performance_tier": status,
        "remedial_skills": remedial_skills,
        "unlocked_skills": unlocked_skills,
        "guidance": guidance,
        "recommended_adaptive_courses": recommended_courses[:4],
    }
