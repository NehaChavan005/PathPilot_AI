from typing import Any
from sqlalchemy.orm import Session
from app.ai.explainer import generate_explanation
from app.ai.skill_extractor import extract_skills
from app.knowledge_graph.skill_graph import SkillGraph
from .collaborative import collaborative_score
from .content_based import compute_content_score, similarity
from .ranking import rank_recommendations


def recommend(
    goal: str,
    items: list[dict[str, Any]],
    user_id: int = 1,
    current_skills: list[str] | None = None,
    missing_skills: list[str] | None = None,
    completed_course_ids: set[int] | None = None,
    db: Session | None = None,
    top_k: int = 10,
    graph: SkillGraph | None = None,
) -> list[dict[str, Any]]:
    """Hybrid multi-signal recommendation pipeline.
    
    Combines semantic relevance, skill-gap coverage, prerequisite readiness, 
    and collaborative peer signals with full XAI explanations.
    """
    if not items:
        return []

    completed_ids = completed_course_ids or set()
    current_skills = current_skills or []
    missing_skills = missing_skills or []
    if graph is None:
        graph = SkillGraph()

    scored_items: list[dict[str, Any]] = []

    for item in items:
        course_id = item.get("id", 0)

        # Exclude courses already completed by the learner
        if course_id in completed_ids:
            continue

        # 1. Content and Skill-Gap matching
        content_res = compute_content_score(goal, item, missing_skills)
        content_score = content_res["content_score"]
        skill_gap_score = content_res["skill_gap_score"]
        covered_skills = content_res["covered_skills"]
        course_skills = content_res["course_skills"]

        # 2. Collaborative / Peer popularity signal
        collab_score = collaborative_score(user_id, course_id, db)

        # 3. Prerequisite alignment
        # Check if the course skills have unmet foundational prerequisites
        unmet_prereqs = graph.find_missing_prerequisites(course_skills, current_skills)
        if unmet_prereqs:
            # Penalize slightly if learner lacks foundational prerequisites for this course
            prereq_score = max(0.4, 1.0 - (0.2 * len(unmet_prereqs)))
        else:
            prereq_score = 1.0

        # 4. Multi-signal weighted hybrid formula
        # Content (35%), Skill Gaps (35%), Collaborative (15%), Prerequisite Readiness (15%)
        hybrid_score = (
            (0.35 * content_score) +
            (0.35 * skill_gap_score) +
            (0.15 * collab_score) +
            (0.15 * prereq_score)
        )
        hybrid_score = round(min(1.0, max(0.0, hybrid_score)), 3)

        # 5. Generate Explainable AI (XAI) rationale
        xai = generate_explanation(
            course_title=item.get("title", ""),
            target_role=goal,
            covered_skills=covered_skills,
            current_skills=current_skills,
            content_score=content_score,
            skill_gap_score=skill_gap_score,
            collaborative_score=collab_score,
            prerequisite_score=prereq_score,
            difficulty=item.get("difficulty", "Intermediate"),
        )

        item_copy = dict(item)
        item_copy["score"] = hybrid_score
        item_copy["reason"] = xai["reason"]
        item_copy["key_factors"] = xai["key_factors"]
        item_copy["score_breakdown"] = xai["score_breakdown"]
        item_copy["covered_skills"] = covered_skills
        item_copy["course_skills"] = course_skills

        scored_items.append(item_copy)

    # Re-rank with diversity enforcement
    return rank_recommendations(scored_items, top_k=top_k, enforce_diversity=True)
