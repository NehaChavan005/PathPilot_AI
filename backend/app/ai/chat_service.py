from typing import Any
from .llm_service import LLMService


def answer(
    message: str,
    name: str | None = None,
    learner_context: dict[str, Any] | None = None,
) -> str:
    """Context-aware AI learning assistant and mentor.
    
    Incorporates learner's profile, target role, skill gaps, roadmap milestone, 
    and progress history into the response synthesis.
    """
    user_name = name or "Learner"
    context = learner_context or {}
    target_role = context.get("target_role", "Software Engineer")
    skills = context.get("current_skills", [])
    skill_gaps = context.get("skill_gaps", [])
    current_milestone = context.get("current_milestone", "Foundations")
    avg_progress = context.get("average_progress", 0.0)

    # Build contextual system prompt
    system_prompt = (
        f"You are PathPilot AI, a personalized AI learning assistant and mentor. "
        f"You are advising {user_name}, who is working toward becoming a {target_role}. "
        f"Their verified skills are: {', '.join(skills) if skills else 'Starting fresh'}. "
        f"Their primary skill gaps to bridge are: {', '.join(skill_gaps[:4]) if skill_gaps else 'Core fundamentals'}. "
        f"Current roadmap stage: {current_milestone}. "
        f"Average course completion progress: {avg_progress}%. "
        f"Be encouraging, concise, actionable, and focus on practical learning next steps."
    )

    llm = LLMService()

    if llm.provider != "offline_engine":
        return llm.generate(prompt=message, system_prompt=system_prompt)

    # Contextual offline mentor engine
    msg_lower = message.lower()

    if any(w in msg_lower for w in ["next", "where to start", "what should i learn", "roadmap"]):
        next_topic = skill_gaps[0] if skill_gaps else "core programming fundamentals"
        return (
            f"Hello {user_name}! Based on your goal of becoming a {target_role}, "
            f"your highest priority milestone right now is mastering **{next_topic}**. "
            f"You are currently at {avg_progress}% progress in your active courses. "
            f"I recommend spending 1-2 hours daily focusing on hands-on exercises in {next_topic}."
        )

    if any(w in msg_lower for w in ["stuck", "difficult", "hard", "struggling"]):
        return (
            f"Don't worry {user_name}, hitting plateaus is a natural part of mastering {target_role}. "
            f"Try breaking the current concept into smaller diagnostic steps: "
            f"1) Review the foundational prerequisites, 2) Build a minimal 10-line prototype, "
            f"and 3) Take a short quiz to pinpoint exactly which subtopic is unclear."
        )

    if any(w in msg_lower for w in ["gap", "skills", "weakness"]):
        gaps_str = ", ".join(skill_gaps[:3]) if skill_gaps else "foundational prerequisites"
        return (
            f"{user_name}, your current skill audit indicates key gaps in: **{gaps_str}**. "
            f"Focusing on these will unlock the rest of your {target_role} roadmap."
        )

    return (
        f"{user_name}, for your {target_role} path: {llm.generate(message)}"
    )
