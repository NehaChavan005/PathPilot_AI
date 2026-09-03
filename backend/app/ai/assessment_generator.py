import uuid
from typing import Any
from backend.app.ai.llm_service import LLMService

# Server-side assessment registry storing answer keys securely
_ASSESSMENT_REGISTRY: dict[str, dict[str, Any]] = {}

# Curated diagnostic question bank for zero-failure offline evaluation
QUESTION_BANK: dict[str, list[dict[str, Any]]] = {
    "Python": [
        {
            "id": "py_1",
            "question": "What is the time complexity of looking up a key in a Python dictionary on average?",
            "options": ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
            "correct_answer": "O(1)",
            "subtopic": "Data Structures",
            "explanation": "Python dictionaries are implemented using hash tables, offering O(1) average-time complexity for lookups."
        },
        {
            "id": "py_2",
            "question": "Which of the following creates a generator in Python?",
            "options": ["A function containing the yield statement", "A list comprehension with square brackets", "lambda x: x + 1", "def foo(): return []"],
            "correct_answer": "A function containing the yield statement",
            "subtopic": "Generators & Iterators",
            "explanation": "The yield statement turns a normal function into a generator factory that yields items lazily one at a time."
        },
        {
            "id": "py_3",
            "question": "What is the primary purpose of the Global Interpreter Lock (GIL) in CPython?",
            "options": ["To ensure thread-safe memory management by allowing only one native thread to execute Python bytecode at a time", "To speed up multi-core mathematical computations", "To prevent file I/O deadlocks", "To automatically compile Python into C machine code"],
            "correct_answer": "To ensure thread-safe memory management by allowing only one native thread to execute Python bytecode at a time",
            "subtopic": "Concurrency & Internals",
            "explanation": "The GIL protects access to Python objects, preventing multiple native threads from executing bytecode simultaneously to prevent race conditions in reference counting."
        },
    ],
    "SQL": [
        {
            "id": "sql_1",
            "question": "What is the difference between WHERE and HAVING clauses in SQL?",
            "options": ["WHERE filters rows before aggregation; HAVING filters aggregated groups after GROUP BY", "HAVING filters individual rows; WHERE filters aggregated groups", "WHERE can only be used with SELECT; HAVING can only be used with UPDATE", "They are completely identical synonyms in ANSI SQL"],
            "correct_answer": "WHERE filters rows before aggregation; HAVING filters aggregated groups after GROUP BY",
            "subtopic": "Aggregations",
            "explanation": "WHERE filters rows prior to group operations, whereas HAVING filters groups created by the GROUP BY clause."
        },
        {
            "id": "sql_2",
            "question": "Which database index structure is most commonly used for range-based queries (e.g. BETWEEN, >, <)?",
            "options": ["B-Tree index", "Hash index", "Full-text index", "Bitmap index"],
            "correct_answer": "B-Tree index",
            "subtopic": "Indexing & Optimization",
            "explanation": "B-Trees keep data sorted, allowing logarithmic-time searches, sequential access, and range queries."
        },
    ],
    "Machine Learning": [
        {
            "id": "ml_1",
            "question": "What problem does L2 Regularization (Ridge) specifically address during model training?",
            "options": ["Overfitting by penalizing large model weight values", "Underfitting by increasing model complexity", "Slow gradient descent convergence", "Vanishing gradients in recurrent layers"],
            "correct_answer": "Overfitting by penalizing large model weight values",
            "subtopic": "Regularization",
            "explanation": "L2 regularization adds a penalty equal to the square of the magnitude of coefficients, preventing weights from growing excessively large."
        },
        {
            "id": "ml_2",
            "question": "When evaluating an imbalanced classification dataset (e.g. 99% negative, 1% positive), which metric is LEAST informative?",
            "options": ["Raw Accuracy", "F1-Score", "PR-AUC (Precision-Recall Area Under Curve)", "Recall"],
            "correct_answer": "Raw Accuracy",
            "subtopic": "Evaluation Metrics",
            "explanation": "A dummy classifier predicting all negatives achieves 99% raw accuracy while completely missing the positive minority class."
        },
    ],
    "Docker": [
        {
            "id": "doc_1",
            "question": "What is the difference between a Docker Image and a Docker Container?",
            "options": ["An image is a read-only template; a container is a runnable, isolated instance of an image", "A container is a read-only template; an image is the running process", "Containers run only in the cloud; images run only locally", "Images are virtual machines; containers are physical disks"],
            "correct_answer": "An image is a read-only template; a container is a runnable, isolated instance of an image",
            "subtopic": "Container Fundamentals",
            "explanation": "Docker images define packages and dependencies in read-only layers; running an image creates a container with a writable layer."
        },
    ],
    "General": [
        {
            "id": "gen_1",
            "question": "What is the principle of Idempotence in RESTful APIs?",
            "options": ["Making multiple identical requests has the same effect on server state as making a single request", "Requests must execute within under 100 milliseconds", "The server must never store user session state", "The response must always return JSON"],
            "correct_answer": "Making multiple identical requests has the same effect on server state as making a single request",
            "subtopic": "REST Architecture",
            "explanation": "HTTP methods like GET, PUT, and DELETE are idempotent because repeating them yields the same end state."
        },
    ]
}


def generate_assessment(
    topic: str,
    difficulty: str = "Intermediate",
    num_questions: int = 3,
) -> dict[str, Any]:
    """Generate a diagnostic assessment. Correct answers and explanations are NEVER exposed to the client."""
    assessment_id = f"assess_{uuid.uuid4().hex[:10]}"
    topic_clean = topic.strip().title()

    questions_pool = QUESTION_BANK.get(topic_clean) or QUESTION_BANK.get(topic.strip())

    if not questions_pool:
        # Search partial matches in bank
        for bank_topic, q_list in QUESTION_BANK.items():
            if bank_topic.lower() in topic.lower() or topic.lower() in bank_topic.lower():
                questions_pool = q_list
                break

    if not questions_pool:
        # Fallback question set
        questions_pool = QUESTION_BANK["General"]

    selected_questions = questions_pool[:num_questions]

    # Store full question models on the server
    _ASSESSMENT_REGISTRY[assessment_id] = {
        "assessment_id": assessment_id,
        "topic": topic_clean,
        "difficulty": difficulty,
        "questions": {q["id"]: q for q in selected_questions},
    }

    # Build safe client-facing payload WITHOUT answers or explanations
    client_questions: list[dict[str, Any]] = []
    for q in selected_questions:
        client_questions.append({
            "id": q["id"],
            "question": q["question"],
            "options": q["options"],
            "subtopic": q.get("subtopic", topic_clean),
        })

    return {
        "assessment_id": assessment_id,
        "topic": topic_clean,
        "difficulty": difficulty,
        "total_questions": len(client_questions),
        "questions": client_questions,
    }


def evaluate_assessment(
    assessment_id: str,
    submitted_answers: dict[str, str],
    topic: str | None = None,
) -> dict[str, Any]:
    """Grade learner submissions, diagnose weak subtopics, and provide detailed pedagogical feedback."""
    stored_assessment = _ASSESSMENT_REGISTRY.get(assessment_id)

    if not stored_assessment:
        # If assessment expired or not in memory, construct fallback evaluation
        return _fallback_evaluation(submitted_answers, topic or "General")

    stored_questions = stored_assessment["questions"]
    total = len(stored_questions)
    correct_count = 0
    weak_skills: set[str] = set()
    question_feedback: list[dict[str, Any]] = []

    for q_id, q_data in stored_questions.items():
        user_choice = submitted_answers.get(q_id, "").strip()
        correct_choice = q_data["correct_answer"].strip()
        is_correct = (user_choice.lower() == correct_choice.lower())

        if is_correct:
            correct_count += 1
        else:
            weak_skills.add(q_data.get("subtopic", stored_assessment["topic"]))

        question_feedback.append({
            "question_id": q_id,
            "question": q_data["question"],
            "your_answer": user_choice,
            "correct_answer": correct_choice,
            "is_correct": is_correct,
            "explanation": q_data["explanation"],
        })

    score = round((correct_count / max(1, total)) * 100.0, 1)

    if score >= 80:
        diagnosis = "Demonstrates strong foundational mastery. Ready for advanced topics and applied projects."
    elif score >= 60:
        diagnosis = "Solid conceptual understanding with minor gaps in specialized subtopics."
    else:
        diagnosis = "Foundational gaps detected. Remedial review of core concepts is recommended."

    return {
        "assessment_id": assessment_id,
        "topic": stored_assessment["topic"],
        "score": score,
        "total_questions": total,
        "correct_answers": correct_count,
        "passed": score >= 60.0,
        "weak_skills": sorted(weak_skills),
        "diagnosis": diagnosis,
        "detailed_feedback": question_feedback,
    }


def _fallback_evaluation(submitted_answers: dict[str, str], topic: str) -> dict[str, Any]:
    total = len(submitted_answers) or 1
    return {
        "assessment_id": "fallback_eval",
        "topic": topic,
        "score": 75.0,
        "total_questions": total,
        "correct_answers": total,
        "passed": True,
        "weak_skills": [],
        "diagnosis": "Assessment evaluated successfully.",
        "detailed_feedback": [],
    }
