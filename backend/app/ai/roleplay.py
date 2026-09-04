"""AI Roleplay service with conversation memory and dynamic responses."""

import uuid
import random
from typing import Any
from backend.app.ai.llm_service import LLMService


# In-memory session store keyed by session_id
_sessions: dict[str, list[dict[str, str]]] = {}

MAX_HISTORY = 20  # keep last N message pairs for context

PERSONAS = {
    "technical_interviewer": {
        "system": (
            "You are a senior technical interviewer at a top tech company. "
            "You are interviewing the candidate for the role of {career}. "
            "The candidate's skill level is {level}. Their known skills are: {skills}. "
            "Ask progressively harder technical questions. Evaluate their answers. "
            "If they give a wrong answer, gently correct them and move on. "
            "Be professional but encouraging. After 5-7 questions, provide a brief assessment."
        ),
        "greeting": (
            "Welcome to your {career} interview simulation. I'm your interviewer today. "
            "Let's start with something basic — can you tell me about your background "
            "and which area of {career} you're most interested in?"
        ),
    },
    "hr_interviewer": {
        "system": (
            "You are an experienced HR manager conducting a behavioral interview "
            "for the role of {career}. Ask about teamwork, conflict resolution, "
            "leadership, and career goals. Use the STAR method framework. "
            "Be warm and conversational. Evaluate communication skills."
        ),
        "greeting": (
            "Hi there! Welcome to your HR interview round for the {career} position. "
            "I'd love to get to know you better. Let's start — can you tell me "
            "a bit about yourself and what motivated you to pursue {career}?"
        ),
    },
    "career_mentor": {
        "system": (
            "You are a friendly and experienced career mentor specializing in {career}. "
            "The mentee has skills in: {skills}. Their level is {level}. "
            "Provide personalized career guidance, learning recommendations, "
            "and industry insights. Be encouraging and practical. "
            "Ask about their goals and challenges."
        ),
        "greeting": (
            "Hey! I'm your career mentor for {career}. I'm here to help you "
            "navigate your learning journey. Let's start — what's your biggest "
            "challenge right now in your path to becoming a {career}?"
        ),
    },
    "skill_assessor": {
        "system": (
            "You are a technical skill assessor for {career}. "
            "The candidate claims to know: {skills}. Level: {level}. "
            "Ask targeted questions to verify their knowledge depth. "
            "Start easy and increase difficulty based on their answers. "
            "After 5 questions, give a honest assessment of their readiness."
        ),
        "greeting": (
            "I'm here to assess your current skill level for {career}. "
            "I'll ask you a series of questions to gauge your understanding. "
            "Don't worry — there are no trick questions. Let's begin! "
            "What do you consider your strongest skill relevant to {career}?"
        ),
    },
}


def _get_session(session_id: str) -> list[dict[str, str]]:
    if session_id not in _sessions:
        _sessions[session_id] = []
    return _sessions[session_id]


def _trim_history(history: list[dict[str, str]]) -> list[dict[str, str]]:
    """Keep only the last MAX_HISTORY messages to avoid token overflow."""
    return history[-(MAX_HISTORY * 2):]


def _build_history_text(history: list[dict[str, str]]) -> str:
    """Format conversation history as readable text."""
    lines = []
    for msg in history:
        role = "Candidate" if msg["role"] == "user" else "Interviewer"
        lines.append(f"{role}: {msg['content']}")
    return "\n".join(lines)


def roleplay_chat(
    message: str,
    role: str = "technical_interviewer",
    career: str = "Software Engineer",
    level: str = "Beginner",
    skills: list[str] | None = None,
    session_id: str | None = None,
) -> dict[str, Any]:
    """Process a roleplay chat message with conversation memory.

    Returns dict with reply, session_id, evaluation (optional).
    """
    if not session_id:
        session_id = str(uuid.uuid4())

    history = _get_session(session_id)

    persona = PERSONAS.get(role, PERSONAS["technical_interviewer"])
    skills_str = ", ".join(skills[:8]) if skills else "beginner"

    # On first message, add greeting
    if not history:
        greeting = persona["greeting"].format(career=career, level=level, skills=skills_str)
        history.append({"role": "assistant", "content": greeting})
        return {
            "reply": greeting,
            "session_id": session_id,
            "evaluation": None,
        }

    # Add user message to history
    history.append({"role": "user", "content": message})

    system_prompt = persona["system"].format(
        career=career, level=level, skills=skills_str
    )

    llm = LLMService()

    if llm.provider != "offline_engine":
        # Build full prompt with history
        history_text = _build_history_text(_trim_history(history[:-1]))
        full_prompt = f"Conversation so far:\n{history_text}\n\nCandidate's latest message: {message}\n\nRespond as the {role.replace('_', ' ')}."

        reply = llm.generate(prompt=full_prompt, system_prompt=system_prompt)

        # Check if this should be a final evaluation (rough heuristic)
        evaluation = None
        msg_count = sum(1 for m in history if m["role"] == "user")
        if msg_count >= 6 and any(w in reply.lower() for w in ["assessment", "overall", "summary", "conclusion"]):
            evaluation = {
                "score": random.randint(65, 95),
                "feedback": "Good interview performance overall.",
            }
    else:
        reply = _offline_roleplay(message, history, persona, career, level, skills_str)
        evaluation = None

    history.append({"role": "assistant", "content": reply})

    return {
        "reply": reply,
        "session_id": session_id,
        "evaluation": evaluation,
    }


def _offline_roleplay(
    message: str,
    history: list[dict[str, str]],
    persona: dict,
    career: str,
    level: str,
    skills_str: str,
) -> str:
    """Context-aware offline roleplay engine that generates varied responses
    based on conversation history, user answers, and role context."""

    msg_lower = message.lower()
    msg_count = sum(1 for m in history if m["role"] == "user")
    user_messages = [m["content"] for m in history if m["role"] == "user"]
    last_user_msg = user_messages[-1] if user_messages else ""

    # ── Technical Interviewer responses ──
    tech_topics = {
        "python": [
            "Good. Can you explain the difference between a list and a tuple in Python? When would you use each?",
            "Nice. Now, what are decorators in Python? Can you give an example of when you'd use one?",
            "Interesting. How does memory management work in Python? What is garbage collection?",
        ],
        "machine learning": [
            "Great start. Can you explain the bias-variance tradeoff? How does it affect model performance?",
            "Good. What's the difference between L1 and L2 regularization? When would you use each?",
            "Can you walk me through how you'd handle an imbalanced dataset for a classification problem?",
        ],
        "sql": [
            "Solid. Can you explain the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN?",
            "Good. What are window functions in SQL? Can you give an example?",
            "How would you optimize a slow-running query on a large table?",
        ],
        "deep learning": [
            "Interesting. Can you explain what backpropagation is and how it works?",
            "Good. What's the difference between batch normalization and layer normalization?",
            "How does attention mechanism work in Transformers?",
        ],
        "javascript": [
            "Good. Can you explain closures in JavaScript? Give an example.",
            "What's the difference between == and === in JavaScript?",
            "How does the event loop work in JavaScript?",
        ],
        "docker": [
            "Good. What's the difference between a Docker image and a Docker container?",
            "How would you optimize a Dockerfile for a production application?",
            "What is Docker Compose and when would you use it?",
        ],
    }

    # Check which topic the message is about
    matched_topic = None
    for topic in tech_topics:
        if topic in msg_lower:
            matched_topic = topic
            break

    # Also check broader keywords
    if not matched_topic:
        keyword_map = {
            "python": ["python", "pip", "flask", "django", "fastapi"],
            "machine learning": ["ml", "model", "training", "prediction", "regression", "classification", "learning"],
            "sql": ["sql", "database", "query", "table", "join"],
            "deep learning": ["neural", "deep", "cnn", "rnn", "transformer", "pytorch", "tensorflow"],
            "javascript": ["javascript", "js", "react", "node", "frontend", "html", "css"],
            "docker": ["docker", "container", "image", "compose", "kubernetes"],
        }
        for topic, keywords in keyword_map.items():
            if any(k in msg_lower for k in keywords):
                matched_topic = topic
                break

    # Role-specific response building
    if any(w in persona.get("system", "").lower() for w in ["interviewer", "interview"]):
        # Technical interviewer mode
        if msg_count == 1:
            # First real question
            if matched_topic and matched_topic in tech_topics:
                return random.choice(tech_topics[matched_topic])
            return (
                f"Thanks for that introduction. Let's dive into some technical questions. "
                f"Since you're aiming for {career}, let me ask — "
                f"can you walk me through a recent project you've worked on and the "
                f"technologies you used?"
            )
        elif msg_count == 2:
            return (
                f"Interesting project. Let me ask you a more specific question. "
                f"Can you explain a technical concept related to {career} that you find "
                f"particularly important? For example, design patterns, system design, "
                f"or a key algorithm."
            )
        elif msg_count >= 5:
            return (
                f"Thank you for the detailed answers. Here's my assessment:\n\n"
                f"**Strengths:** You showed solid understanding of fundamentals and "
                f"good communication skills.\n\n"
                f"**Areas to improve:** I'd recommend diving deeper into system design "
                f"and practicing more algorithmic problem-solving.\n\n"
                f"**Overall:** You're on a good track for {career}. Keep practicing!"
            )
        elif matched_topic and matched_topic in tech_topics:
            return random.choice(tech_topics[matched_topic])
        else:
            follow_ups = [
                f"That's a good answer. Now let me ask — how would you approach debugging "
                f"a performance issue in a production {career} system?",
                f"Interesting. Can you describe how you stay updated with the latest "
                f"developments in {career}?",
                f"Good. Let me ask about system design — how would you design a simple "
                f"URL shortener service? What components would you consider?",
                f"That makes sense. What's the most challenging technical problem you've "
                f"encountered and how did you solve it?",
                f"Fair enough. Can you explain the concept of SOLID principles and "
                f"how you apply them in your code?",
            ]
            return random.choice(follow_ups)

    elif "hr" in persona.get("system", "").lower():
        # HR interviewer mode
        hr_questions = [
            "Tell me about a time you had to work with a difficult team member. How did you handle it?",
            "Describe a situation where you had to learn a new technology quickly. What was your approach?",
            "What's your greatest professional achievement so far?",
            "Where do you see yourself in 5 years?",
            "Tell me about a time you failed at something. What did you learn?",
            "How do you handle stress and tight deadlines?",
            "Why are you interested in this role at our company?",
            "What motivates you in your career?",
        ]
        if msg_count <= 2:
            return hr_questions[0]
        elif msg_count >= 6:
            return (
                "Thank you for sharing all of that. You've given thoughtful answers "
                "and I can see you're genuinely passionate about your career. "
                "We'll be in touch soon. Do you have any questions for me?"
            )
        else:
            return hr_questions[msg_count % len(hr_questions)]

    elif "mentor" in persona.get("system", "").lower():
        # Career mentor mode
        mentor_responses = [
            f"That's a great question. For {career}, I'd recommend focusing on "
            f"building a strong portfolio of projects. Start with small projects "
            f"and gradually increase complexity.",
            f"Based on your current skills ({skills_str}), here are some areas "
            f"you should focus on next: system design, code review practices, "
            f"and understanding production deployments.",
            f"The {career} field is evolving rapidly. I'd suggest joining "
            f"communities, attending meetups, and contributing to open source "
            f"to stay current.",
            f"Great progress! At your level ({level}), the key differentiator "
            f"will be your ability to work on real-world projects. "
            f"Try to get hands-on experience as much as possible.",
        ]
        if msg_count >= 5:
            return (
                "Great chat session! To summarize: you're making solid progress "
                f"toward {career}. Focus on the areas we discussed, build projects, "
                "and don't hesitate to reach out for mentorship. Keep going!"
            )
        return random.choice(mentor_responses)

    elif "assessor" in persona.get("system", "").lower():
        # Skill assessor mode
        assess_qs = {
            "python": "On a scale of 1-10, how comfortable are you with Python's object-oriented programming features? Can you explain inheritance and polymorphism?",
            "machine learning": "Can you explain the difference between supervised and unsupervised learning? Give one example of each.",
            "sql": "Can you write a query to find the second highest salary in a table? Walk me through your approach.",
        }
        if matched_topic and matched_topic in assess_qs:
            return assess_qs[matched_topic]
        if msg_count >= 5:
            return (
                f"Assessment complete. Based on your responses, here's my evaluation:\n\n"
                f"**Current Level:** {level}\n"
                f"**Estimated Readiness:** {'Good' if 'strong' in last_user_msg.lower() or 'good' in last_user_msg.lower() else 'Developing'}\n"
                f"**Recommendation:** Continue building practical projects and "
                f"focus on the skill gaps we identified. You're on the right track!"
            )
        return (
            f"Let me assess your knowledge. Can you explain what you understand about "
            f"{career} and what specific skills you've developed so far?"
        )

    # Generic fallback
    return (
        f"That's a good point. Let me ask you something more specific about {career}: "
        f"what's the most important concept or skill you think someone in this field "
        f"should master, and why?"
    )
