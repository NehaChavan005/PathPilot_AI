from typing import Any
from app.ai.llm_service import LLMService
from app.ai.skill_extractor import extract_skills
from app.knowledge_graph.ontology import ROLE_SKILL_TAXONOMY


def _match_target_role(goal: str) -> str:
    """Identify the primary target role from goal text."""
    goal_lower = goal.lower()

    # Exact or substring matches
    for role in ROLE_SKILL_TAXONOMY:
        if role.lower() in goal_lower:
            return role

    # Semantic keyword hints
    hints = {
        "Data Scientist": ["data science", "data scientist", "analytics", "statistics", "dataset"],
        "Machine Learning Engineer": ["machine learning", "ml engineer", "deep learning", "neural", "model training"],
        "Full Stack Developer": ["full stack", "fullstack", "web app", "mern", "frontend and backend"],
        "Frontend Developer": ["frontend", "front end", "ui", "ux", "react developer", "css", "html"],
        "Backend Developer": ["backend", "back end", "server", "api", "fastapi", "django"],
        "DevOps Engineer": ["devops", "kubernetes", "docker", "ci/cd", "infrastructure", "cloud deployment"],
        "Data Engineer": ["data engineer", "data pipeline", "etl", "spark", "warehousing"],
        "Cloud Engineer": ["cloud engineer", "aws", "azure", "cloud architecture"],
        "AI Engineer": ["ai engineer", "artificial intelligence", "generative ai", "llm", "agents"],
        "Cybersecurity Analyst": ["cybersecurity", "security", "penetration testing", "infosec", "soc"],
    }

    for role, keywords in hints.items():
        if any(kw in goal_lower for kw in keywords):
            return role

    return "Full Stack Developer"


def analyze_goal(goal: str, profile_context: dict[str, Any] | None = None) -> dict[str, Any]:
    """Analyze a learner's career goal into target role, core competencies, difficulty, and learning direction."""
    if not goal or not goal.strip():
        goal = (profile_context or {}).get("target_role") or "Full Stack Developer"

    matched_role = _match_target_role(goal)
    taxonomy_data = ROLE_SKILL_TAXONOMY.get(matched_role, {
        "required": ["Python", "SQL", "Git", "REST API"],
        "recommended": ["Docker", "Data Structures"],
    })

    explicit_skills = extract_skills(goal)
    core_skills = taxonomy_data["required"]
    recommended_skills = taxonomy_data["recommended"]

    # Calculate overall difficulty
    advanced_skills = {"Deep Learning", "Kubernetes", "PyTorch", "TensorFlow", "Infrastructure as Code", "Big Data"}
    if any(s in advanced_skills for s in core_skills):
        difficulty = "Advanced"
        est_weeks = 24
    elif len(core_skills) > 5:
        difficulty = "Intermediate"
        est_weeks = 16
    else:
        difficulty = "Beginner"
        est_weeks = 8

    learning_direction = (
        f"To achieve your goal of becoming a {matched_role}, begin with foundational "
        f"competencies ({', '.join(core_skills[:3])}), followed by applied specializations "
        f"({', '.join(core_skills[3:] or recommended_skills[:2])}). Build 2-3 portfolio projects "
        f"demonstrating real-world problem solving."
    )

    # If LLM service is available, enrich with a personalized coaching tip
    llm = LLMService()
    coaching_tip = ""
    if llm.provider != "offline_engine":
        try:
            prompt = (
                f"A learner has the career goal: '{goal}'. Their target role is {matched_role}. "
                f"Provide a 2-sentence actionable coaching recommendation for their learning path."
            )
            coaching_tip = llm.generate(prompt, temperature=0.3)
        except Exception:
            coaching_tip = ""

    return {
        "original_goal": goal,
        "target_role": matched_role,
        "difficulty_level": difficulty,
        "estimated_duration_weeks": est_weeks,
        "core_skills": core_skills,
        "recommended_skills": recommended_skills,
        "explicitly_mentioned_skills": explicit_skills,
        "suggested_learning_direction": learning_direction,
        "coaching_tip": coaching_tip or learning_direction,
    }
