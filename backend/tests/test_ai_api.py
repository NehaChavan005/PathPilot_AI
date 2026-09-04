import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.app.database.init_db import init_db

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    init_db()
    from backend.app.database.seed import seed_database
    seed_database()
    yield


@pytest.fixture(scope="module")
def auth_header():
    """Register and log in a test user to obtain a bearer token."""
    email = "test_learner@example.com"
    password = "SecurePassword123!"

    # Register
    res = client.post("/api/auth/register", json={"email": email, "password": password, "full_name": "Test Learner"})
    if res.status_code == 409:
        pass  # already exists

    # Login
    res = client.post("/api/auth/login", json={"email": email, "password": password})
    assert res.status_code == 200, res.text
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_root_and_health():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"

    res = client.get("/health")
    assert res.status_code == 200


def test_api_goal_analysis(auth_header):
    res = client.post(
        "/api/ai/goal-analysis",
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
        "/api/ai/skill-gaps",
        json={"target_role": "DevOps Engineer", "current_skills": ["Git", "Linux"]},
        headers=auth_header,
    )
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["target_role"] == "DevOps Engineer"
    assert "Linux" in data["matching_skills"]
    assert data["gaps_count"] > 0


def test_api_recommendations(auth_header):
    res_gen = client.post(
        "/api/recommendations/generate",
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
        "/api/roadmaps/generate",
        json={"target_role": "Data Scientist", "weekly_study_hours": 12},
        headers=auth_header,
    )
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["target_role"] == "Data Scientist"
    assert len(data["milestones"]) > 0
    assert len(data["steps"]) > 0


def test_api_assessment_generate_and_evaluate(auth_header):
    res_gen = client.post(
        "/api/assessments/generate",
        json={"topic": "Python", "difficulty": "Intermediate", "num_questions": 2},
        headers=auth_header,
    )
    assert res_gen.status_code == 200, res_gen.text
    quiz = res_gen.json()
    assert quiz["total_questions"] == 2
    assessment_id = quiz["assessment_id"]

    for q in quiz["questions"]:
        assert "correct_answer" not in q

    res_eval = client.post(
        "/api/assessments/evaluate",
        json={"assessment_id": assessment_id, "answers": {"py_1": "O(1)"}},
        headers=auth_header,
    )
    assert res_eval.status_code == 200, res_eval.text
    evaluation = res_eval.json()
    assert evaluation["score"] >= 0
    assert "detailed_feedback" in evaluation


def test_api_chat(auth_header):
    res = client.post(
        "/api/chat",
        json={"message": "What should I focus on next for my data science journey?"},
        headers=auth_header,
    )
    assert res.status_code == 200, res.text
    assert "reply" in res.json()
    assert len(res.json()["reply"]) > 15


def test_api_adaptive_recalibration(auth_header):
    res = client.post(
        "/api/ai/adaptive/recalibrate",
        json={"topic": "Python", "assessment_score": 50.0, "target_role": "Data Scientist"},
        headers=auth_header,
    )
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["action"] == "remediation"
    assert len(data["remedial_skills"]) > 0


def test_api_what_if_simulation(auth_header):
    res = client.post(
        "/api/ai/simulation/what-if",
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


def test_api_feedback(auth_header):
    res = client.post(
        "/api/feedback",
        json={"feedback_type": "like", "course_id": None, "message": "Great roadmap"},
        headers=auth_header,
    )
    assert res.status_code == 201, res.text
    data = res.json()
    assert data["feedback_type"] == "like"

    list_res = client.get("/api/feedback", headers=auth_header)
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1


def test_api_dashboard(auth_header):
    res = client.get("/api/dashboard", headers=auth_header)
    assert res.status_code == 200, res.text
    data = res.json()
    assert "user_id" in data
    assert "courses_enrolled" in data
