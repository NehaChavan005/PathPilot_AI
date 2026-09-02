import pytest
from app.ai.adaptive_engine import recalibrate_learning_path
from app.ai.assessment_generator import evaluate_assessment, generate_assessment
from app.ai.chat_service import answer
from app.ai.embeddings import get_embedding, semantic_similarity
from app.ai.explainer import generate_explanation
from app.ai.goal_analyzer import analyze_goal
from app.ai.roadmap_generator import generate_personalized_roadmap
from app.ai.simulator import simulate_scenario
from app.ai.skill_extractor import assess_skill_gaps, extract_skills
from app.knowledge_graph.skill_graph import SkillGraph
from app.recommender.hybrid import recommend

SAMPLE_COURSES = [
    {
        "id": 1,
        "title": "Python for Data Science and Machine Learning",
        "description": "Comprehensive course on Python, Pandas, NumPy, and Scikit-Learn.",
        "skills": ["Python", "Pandas", "Machine Learning", "Scikit-Learn"],
        "difficulty": "Intermediate",
    },
    {
        "id": 2,
        "title": "SQL and Database Design Fundamentals",
        "description": "Master relational database schema design, SQL joins, and indexing.",
        "skills": ["SQL", "Database Design"],
        "difficulty": "Beginner",
    },
    {
        "id": 3,
        "title": "Deep Learning with PyTorch",
        "description": "Build deep neural networks and NLP models with PyTorch.",
        "skills": ["Deep Learning", "PyTorch"],
        "difficulty": "Advanced",
    },
    {
        "id": 4,
        "title": "Docker and Kubernetes DevOps",
        "description": "Container orchestration, CI/CD, and cloud deployments.",
        "skills": ["Docker", "Kubernetes", "CI/CD"],
        "difficulty": "Intermediate",
    },
]


# Feature 1: Goal Analysis
def test_feature_1_goal_analysis():
    res = analyze_goal("I want to become a Senior Data Scientist using Python and SQL")
    assert res["target_role"] == "Data Scientist"
    assert "Python" in res["core_skills"]
    assert "SQL" in res["core_skills"]
    assert "Statistics" in res["core_skills"]
    assert res["estimated_duration_weeks"] > 0
    assert len(res["suggested_learning_direction"]) > 20


# Feature 2: Skill Extraction & Skill Gap Detection
def test_feature_2_skill_extraction_and_gaps():
    text = "Experienced in Python, sql, and k8s, currently learning React.js"
    extracted = extract_skills(text)
    assert "Python" in extracted
    assert "SQL" in extracted
    assert "Kubernetes" in extracted  # Alias resolved
    assert "React" in extracted       # Alias resolved

    gap_res = assess_skill_gaps(
        current_skills=["Python"],
        target_role="Data Scientist",
    )
    assert "Python" in gap_res["matching_skills"]
    assert gap_res["readiness_score"] > 0
    assert gap_res["gaps_count"] > 0

    # Ensure prioritized gaps exist with HIGH priority for foundational gaps
    priorities = [g["priority"] for g in gap_res["skill_gaps"]]
    assert "HIGH" in priorities


# Feature 3: AI Embeddings
def test_feature_3_embeddings_and_semantic_similarity():
    vec = get_embedding("Python Machine Learning")
    assert isinstance(vec, list)
    assert len(vec) > 0

    # Test semantic discrimination
    sim_related = semantic_similarity("Python Machine Learning", "Data Science Neural Networks")
    sim_unrelated = semantic_similarity("Python Machine Learning", "Baking bread and making pastry dough")
    assert sim_related > sim_unrelated


# Feature 4: Recommendation Engine (Hybrid)
def test_feature_4_hybrid_recommendation_engine():
    recs = recommend(
        goal="Data Scientist",
        items=SAMPLE_COURSES,
        user_id=1,
        current_skills=["Python"],
        missing_skills=["SQL", "Machine Learning"],
        completed_course_ids={2},  # Course 2 is completed
    )

    assert len(recs) > 0
    # Completed course (id: 2) must be excluded
    rec_ids = [r["id"] for r in recs]
    assert 2 not in rec_ids

    # Top recommendation should be relevant to Data Science
    assert recs[0]["id"] == 1
    assert recs[0]["score"] > 0.5


# Feature 5: Explainable AI (XAI)
def test_feature_5_explainable_ai():
    recs = recommend(
        goal="Data Scientist",
        items=SAMPLE_COURSES,
        user_id=1,
        current_skills=["Python"],
        missing_skills=["Machine Learning"],
    )

    top_rec = recs[0]
    assert "reason" in top_rec
    assert "key_factors" in top_rec
    assert "score_breakdown" in top_rec
    assert len(top_rec["key_factors"]) > 0

    breakdown = top_rec["score_breakdown"]
    assert "skill_match" in breakdown
    assert "semantic_content" in breakdown
    assert "collaborative_popularity" in breakdown
    assert "prerequisite_relevance" in breakdown


# Feature 6: Personalized Prerequisite-Aware Roadmap
def test_feature_6_personalized_roadmap():
    roadmap = generate_personalized_roadmap(
        target_role="Data Scientist",
        current_skills=["Programming Fundamentals"],
        available_courses=SAMPLE_COURSES,
        weekly_study_hours=10,
    )

    assert roadmap["target_role"] == "Data Scientist"
    assert roadmap["estimated_total_hours"] > 0
    assert roadmap["estimated_total_weeks"] > 0
    assert len(roadmap["milestones"]) >= 2
    assert len(roadmap["steps"]) >= 2

    # Check that phase 1 precedes phase 2
    milestone_names = [m["title"] for m in roadmap["milestones"]]
    assert "Phase 1: Foundations & Core Prerequisites" in milestone_names[0]


# Feature 7: AI Assessments
def test_feature_7_ai_assessments():
    # 1. Generation
    quiz = generate_assessment(topic="Python", difficulty="Intermediate", num_questions=2)
    assert quiz["total_questions"] == 2
    assessment_id = quiz["assessment_id"]

    # Security check: answers must NOT be in client payload
    for q in quiz["questions"]:
        assert "correct_answer" not in q
        assert "explanation" not in q

    # 2. Evaluation
    eval_res = evaluate_assessment(
        assessment_id=assessment_id,
        submitted_answers={"py_1": "O(1)", "py_2": "Wrong Answer"},
    )
    assert eval_res["score"] == 50.0
    assert eval_res["passed"] is False
    assert len(eval_res["detailed_feedback"]) == 2
    assert eval_res["detailed_feedback"][0]["is_correct"] is True
    assert eval_res["detailed_feedback"][1]["is_correct"] is False


# Feature 8: AI Learning Assistant
def test_feature_8_ai_learning_assistant():
    context = {
        "target_role": "Data Scientist",
        "current_skills": ["Python"],
        "skill_gaps": ["Machine Learning", "SQL"],
        "current_milestone": "Foundations Phase",
        "average_progress": 45.0,
    }
    reply = answer(
        message="What should I learn next?",
        name="Alex",
        learner_context=context,
    )
    assert "Alex" in reply
    assert "Data Scientist" in reply
    assert len(reply) > 30


# Feature 9: Adaptive Learning
def test_feature_9_adaptive_learning():
    # Scenario A: Poor score triggers remediation
    poor_res = recalibrate_learning_path(
        user_id=1,
        target_role="Data Scientist",
        assessment_score=45.0,
        topic="Machine Learning",
        available_courses=SAMPLE_COURSES,
    )
    assert poor_res["action"] == "remediation"
    assert poor_res["performance_tier"] == "needs_improvement"
    assert len(poor_res["remedial_skills"]) > 0

    # Scenario B: High score triggers acceleration
    high_res = recalibrate_learning_path(
        user_id=1,
        target_role="Data Scientist",
        assessment_score=92.0,
        topic="Python",
        available_courses=SAMPLE_COURSES,
    )
    assert high_res["action"] == "acceleration"
    assert high_res["performance_tier"] == "mastered"
    assert len(high_res["unlocked_skills"]) > 0


# Feature 10: What-If Simulation
def test_feature_10_what_if_simulation():
    sim = simulate_scenario(
        current_role="Data Scientist",
        simulated_role="AI Engineer",
        current_skills=["Python", "SQL"],
        current_weekly_hours=5,
        simulated_weekly_hours=15,
        available_courses=SAMPLE_COURSES,
    )

    # Integrity assertions
    assert sim["is_simulation"] is True
    assert sim["database_mutated"] is False

    # Transferable and new skills
    assert "Python" in sim["transferable_skills"]
    assert "Deep Learning" in sim["new_required_skills"]

    # Pacing delta
    assert sim["estimated_weeks_at_simulated_pace"] < sim["estimated_weeks_at_current_pace"]
    assert sim["weeks_saved"] > 0
