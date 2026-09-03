from typing import Any


def rank(items: list[tuple[float, Any]]) -> list[Any]:
    """Legacy rank helper preserved for backward compatibility."""
    return [item for _, item in sorted(items, key=lambda pair: pair[0], reverse=True)]


def rank_recommendations(
    scored_items: list[dict[str, Any]],
    top_k: int = 10,
    enforce_diversity: bool = True
) -> list[dict[str, Any]]:
    """Rank scored course recommendations with diversity penalties and thresholding."""
    if not scored_items:
        return []

    # Sort primarily by hybrid recommendation score
    sorted_items = sorted(scored_items, key=lambda item: item.get("score", 0.0), reverse=True)

    if not enforce_diversity:
        return sorted_items[:top_k]

    # Apply diversity penalty to avoid 5 identical courses teaching the same single skill
    selected: list[dict[str, Any]] = []
    seen_skills_count: dict[str, int] = {}

    for item in sorted_items:
        skills = item.get("covered_skills") or item.get("course_skills", [])
        primary_skill = skills[0] if skills else item.get("title", "")

        penalty = seen_skills_count.get(primary_skill, 0) * 0.05
        adjusted_score = max(0.0, item.get("score", 0.0) - penalty)
        item["adjusted_score"] = round(adjusted_score, 3)

        seen_skills_count[primary_skill] = seen_skills_count.get(primary_skill, 0) + 1
        selected.append(item)

    # Re-sort with diversity penalty applied
    selected.sort(key=lambda x: x["adjusted_score"], reverse=True)
    return selected[:top_k]
