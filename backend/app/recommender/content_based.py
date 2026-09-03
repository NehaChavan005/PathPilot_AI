from typing import Any
from backend.app.ai.embeddings import semantic_similarity, tokenize_embedding
from backend.app.ai.skill_extractor import canonicalize_skill, extract_skills


def similarity(query: str, content: str) -> float:
    """Compute semantic text similarity between query and content."""
    if not query or not content:
        return 0.0
    dense_sim = semantic_similarity(query, content)
    left, right = tokenize_embedding(query), tokenize_embedding(content)
    jaccard = len(left & right) / len(left | right) if (left or right) else 0.0
    return round(0.7 * dense_sim + 0.3 * jaccard, 3)


def skill_coverage_score(
    course_skills: list[str],
    target_gap_skills: list[str]
) -> tuple[float, list[str]]:
    """Compute how well a course covers the learner's missing skill gaps."""
    if not target_gap_skills or not course_skills:
        return 0.0, []

    course_canonical = {canonicalize_skill(s).lower() for s in course_skills}
    covered: list[str] = []

    for gap in target_gap_skills:
        if canonicalize_skill(gap).lower() in course_canonical:
            covered.append(gap)

    # Score: covering 1 key missing skill = 0.60 to 0.85, 2+ = 1.0
    if not covered:
        return 0.0, []
    ratio = len(covered) / max(1, min(2, len(target_gap_skills)))
    score = min(1.0, max(0.6, ratio))
    return round(score, 3), covered


def compute_content_score(
    goal_or_role: str,
    course_item: dict[str, Any],
    missing_skills: list[str] | None = None
) -> dict[str, Any]:
    """Compute comprehensive content-based matching score including semantic and skill gap signals."""
    title = course_item.get("title", "")
    desc = course_item.get("description", "")
    full_text = f"{title} {desc}".strip()

    course_skills = course_item.get("skills") or extract_skills(full_text)

    # 1. Semantic relevance
    sem_sim = similarity(goal_or_role, full_text)

    # 2. Skill gap coverage
    gap_score, covered_gaps = skill_coverage_score(course_skills, missing_skills or [])

    # Composite content score
    if missing_skills and covered_gaps:
        composite = (0.4 * sem_sim) + (0.6 * gap_score)
    else:
        composite = sem_sim

    return {
        "content_score": round(composite, 3),
        "semantic_similarity": round(sem_sim, 3),
        "skill_gap_score": round(gap_score, 3),
        "covered_skills": covered_gaps,
        "course_skills": course_skills,
    }
