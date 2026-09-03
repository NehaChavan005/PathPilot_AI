import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


@pytest.fixture(scope="module")
def auth_header():
    """Register and log in a test user to obtain a bearer token."""
    email = "test_learner@example.com"
    password = "SecurePassword123!"

    # Register
    client.post("/api/v1/auth/register", json={"email": email, "password": password, "full_name": "Test Learner"})

    # Login
    res = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert res.status_code == 200, res.text
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_root_and_health():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "running"

    res = client.get("/health")
    assert res.status_code == 200


def test_api_goal_analysis(auth_header):
    res = client.post(
        "/api/v1/ai/goal-analysis",
        json={"goal": "I want to work in Data Science and Machine Learning"},
        headers=auth_header,
    )
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["target_role"] == "Data Scientist"
    assert "Python" in data["core_skills"]
    assert len(data["suggested_learning_direction"]) > 10


def test_api_skill_gaps(auth_header):
    res = client.post(
        "/api/v1/ai/skill-gaps",
        json={"target_role": "DevOps Engineer", "current_skills": ["Git", "Linux"]},
        headers=auth_header,
    )
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["target_role"] == "DevOps Engineer"
    assert "Linux" in data["matching_skills"]
    assert data["gaps_count"] > 0


def test_api_recommendations(auth_header):
    # Test GET recommendations (auto-generates if empty)
    res = client.get("/api/v1/recommendations", headers=auth_header)
    assert res.status_code == 200, res.text
    items = res.json()
    assert len(items) > 0
    assert "reason" in items[0]
    assert items[0]["score"] > 0

    # Test POST custom recommendations with full XAI
    res_gen = client.post(
        "/api/v1/recommendations/generate",
        json={"target_role": "Data Scientist", "top_k": 3},
        headers=auth_header,
    )
    assert res_gen.status_code == 200, res_gen.text
    detailed = res_gen.json()
    assert len(detailed) > 0
    assert "score_breakdown" in detailed[0]
    assert "key_factors" in detailed[0]


def test_api_roadmap_generate(auth_header):
    res = client.post(
        "/api/v1/roadmaps/generate",
        json={"target_role": "Data Scientist", "weekly_study_hours": 12},
        headers=auth_header,
    )
    assert res.status_code == 201, res.text
    data = res.json()
    assert data["target_role"] == "Data Scientist"
    assert len(data["milestones"]) > 0
    assert len(data["steps"]) > 0


def test_api_assessment_generate_and_evaluate(auth_header):
    # 1. Generate quiz
    res_gen = client.post(
        "/api/v1/assessments/generate",
        json={"topic": "Python", "difficulty": "Intermediate", "num_questions": 2},
        headers=auth_header,
    )
    assert res_gen.status_code == 200, res_gen.text
    quiz = res_gen.json()
    assert quiz["total_questions"] == 2
    assessment_id = quiz["assessment_id"]

    # Verify answers are NOT exposed
    for q in quiz["questions"]:
        assert "correct_answer" not in q

    # 2. Evaluate answers
    res_eval = client.post(
        "/api/v1/assessments/evaluate",
        json={"assessment_id": assessment_id, "answers": {"py_1": "O(1)"}},
        headers=auth_header,
    )
    assert res_eval.status_code == 200, res_eval.text
    evaluation = res_eval.json()
    assert evaluation["score"] >= 0
    assert "detailed_feedback" in evaluation


def test_api_chat(auth_header):
    res = client.post(
        "/api/v1/chat",
        json={"message": "What should I focus on next for my data science journey?"},
        headers=auth_header,
    )
    assert res.status_code == 200, res.text
    assert "reply" in res.json()
    assert len(res.json()["reply"]) > 15


def test_api_adaptive_recalibration(auth_header):
    res = client.post(
        "/api/v1/ai/adaptive/recalibrate",
        json={"topic": "Python", "assessment_score": 50.0, "target_role": "Data Scientist"},
        headers=auth_header,
    )
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["action"] == "remediation"
    assert len(data["remedial_skills"]) > 0


def test_api_what_if_simulation(auth_header):
    res = client.post(
        "/api/v1/ai/simulation/what-if",
        json={
            "current_role": "Full Stack Developer",
            "simulated_role": "AI Engineer",
            "current_weekly_hours": 5,
            "simulated_weekly_hours": 15,
            "current_skills": ["HTML", "JavaScript", "Python"],
        },
        headers=auth_header,
    )
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["is_simulation"] is True
    assert data["database_mutated"] is False
    assert "Python" in data["transferable_skills"]
    assert data["weeks_saved"] > 0
