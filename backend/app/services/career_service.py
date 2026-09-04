from backend.app.ai.goal_analyzer import analyze_goal
from backend.app.ai.skill_extractor import extract_skills
from backend.app.knowledge_graph.ontology import ROLE_SKILL_TAXONOMY


def recommend_career(skills: list[str], interests: list[str] | None = None) -> dict:
    """Recommend a career role based on learner skills and interests.

    Uses the domain ontology to match skills/interests to the best-fit role and
    returns the required competencies and missing skill gaps.
    """
    interests = interests or []
    canonical_skills = {s.strip().lower() for s in skills}

    best_role = None
    best_score = 0

    for role, data in ROLE_SKILL_TAXONOMY.items():
        required_lower = {s.lower() for s in data["required"]}
        recommended_lower = {s.lower() for s in data["recommended"]}

        score = 0
        for s in canonical_skills:
            if s in required_lower:
                score += 2
            elif s in recommended_lower:
                score += 1

        for i in interests:
            if i.strip().lower() in role.lower():
                score += 1

        if score > best_score:
            best_score = score
            best_role = role

        # Quick exact-match preference if the user writes a role name
        for i in interests:
            if i.strip().lower() == role.lower():
                return _role_result(role, skills)

    if best_role is None or best_score == 0:
        # Fall back to goal analysis style heuristic
        combined = " ".join(skills + interests)
        goal_result = analyze_goal(f"My goal is to become a {combined}" if combined else "Full Stack Developer")
        best_role = goal_result["target_role"]

    return _role_result(best_role, skills)


def _role_result(role: str, skills: list[str]) -> dict:
    data = ROLE_SKILL_TAXONOMY.get(role, {
        "required": ["Python", "SQL", "Git", "REST API"],
        "recommended": ["Docker", "Data Structures"],
    })
    current_lower = {s.strip().lower() for s in skills}
    required = data["required"]
    matching = [s for s in required if s.lower() in current_lower]
    missing = [s for s in required if s.lower() not in current_lower]

    return {
        "career": role,
        "reason": f"Your skills are a strong match for {role}.",
        "required_skills": required,
        "recommended_skills": data["recommended"],
        "matching_skills": matching,
        "missing_skills": missing,
        "readiness_percent": round(len(matching) / len(required) * 100, 1) if required else 0.0,
    }
