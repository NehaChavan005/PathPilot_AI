from typing import Any


def generate_explanation(
    course_title: str,
    target_role: str,
    covered_skills: list[str],
    current_skills: list[str] | None = None,
    content_score: float = 0.7,
    skill_gap_score: float = 0.5,
    collaborative_score: float = 0.6,
    prerequisite_score: float = 1.0,
    difficulty: str = "Intermediate",
) -> dict[str, Any]:
    """Generate transparent, factor-based explainability (XAI) rationale for a recommendation."""
    current_skills = current_skills or []
    factors: list[str] = []

    # 1. Primary explanation synthesis
    if covered_skills:
        skill_str = ", ".join(covered_skills[:3])
        if len(covered_skills) > 3:
            skill_str += f" and {len(covered_skills) - 3} other skill(s)"
        primary_reason = (
            f"Recommended because this course directly teaches {skill_str}, "
            f"which are missing competencies for your {target_role} goal."
        )
        factors.append(f"Directly covers {len(covered_skills)} identified skill gap(s)")
    elif skill_gap_score > 0.4:
        primary_reason = f"Recommended to strengthen foundational skills aligned with your {target_role} trajectory."
        factors.append("Strong domain alignment with target role curriculum")
    else:
        primary_reason = f"Recommended based on strong topical relevance to your goal of {target_role}."
        factors.append("High semantic content relevance")

    # 2. Prerequisite factor
    if prerequisite_score >= 0.9 and current_skills:
        factors.append("You have satisfied all prerequisite dependencies for this course")
    elif prerequisite_score < 0.7:
        factors.append("Note: May introduce concepts where earlier prerequisites are recommended")

    # 3. Collaborative / peer consensus factor
    if collaborative_score >= 0.7:
        factors.append(f"Completed and positively reviewed by peers on the {target_role} pathway")
    else:
        factors.append("Standard core curriculum milestone")

    factors.append(f"Appropriate difficulty level: {difficulty}")

    return {
        "reason": primary_reason,
        "key_factors": factors,
        "score_breakdown": {
            "skill_match": round(skill_gap_score, 3),
            "semantic_content": round(content_score, 3),
            "collaborative_popularity": round(collaborative_score, 3),
            "prerequisite_relevance": round(prerequisite_score, 3),
        },
    }
