from datetime import datetime, timezone

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.api.progress import router as progress_router
from backend.app.database.base import Base
from backend.app.database.connection import get_db
from backend.app.models.assessment import Assessment, AssessmentResult
from backend.app.models.course import Course
from backend.app.models.skill import Skill
from backend.app.models.user import User

TEST_DB_URL = "sqlite:///./test_progress.db"
engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Build an isolated app for these tests so we never interfere with other test
# modules that override the shared `get_db` dependency on the main app.
test_app = FastAPI()
test_app.include_router(progress_router, prefix="/api")
test_app.dependency_overrides[get_db] = override_get_db
client = TestClient(test_app)


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def _seed(db):
    user = User(email="demo@pathpilot.ai", password_hash="x", full_name="Demo")
    db.add(user)
    db.flush()

    skill_py = Skill(name="Python", category="Programming", description="Python")
    skill_ml = Skill(name="Machine Learning", category="AI/ML", description="ML")
    db.add_all([skill_py, skill_ml])
    db.flush()

    course_py = Course(
        title="Python Fundamentals",
        description="Learn Python",
        category="Programming",
        difficulty="beginner",
        duration_hours=20,
        provider="PathPilot",
    )
    course_ml = Course(
        title="Machine Learning",
        description="Learn ML",
        category="AI/ML",
        difficulty="intermediate",
        duration_hours=40,
        provider="PathPilot",
    )
    db.add_all([course_py, course_ml])
    db.flush()

    assessment_py = Assessment(
        title="Python Test",
        skill_id=skill_py.id,
        questions_json="[]",
    )
    assessment_ml = Assessment(
        title="ML Test",
        skill_id=skill_ml.id,
        questions_json="[]",
    )
    db.add_all([assessment_py, assessment_ml])
    db.flush()

    db.add_all(
        [
            AssessmentResult(user_id=user.id, assessment_id=assessment_py.id, score=45,
                             submitted_at=datetime(2025, 1, 1, tzinfo=timezone.utc)),
            AssessmentResult(user_id=user.id, assessment_id=assessment_py.id, score=78,
                             submitted_at=datetime(2025, 2, 1, tzinfo=timezone.utc)),
            AssessmentResult(user_id=user.id, assessment_id=assessment_ml.id, score=40,
                             submitted_at=datetime(2025, 1, 15, tzinfo=timezone.utc)),
            AssessmentResult(user_id=user.id, assessment_id=assessment_ml.id, score=65,
                             submitted_at=datetime(2025, 3, 1, tzinfo=timezone.utc)),
        ]
    )

    db.commit()
    return {"user_id": user.id, "course_py": course_py.id, "course_ml": course_ml.id}


def _seed_two_users(db):
    """Seed two users plus courses so we can verify isolation at service level."""
    u1 = User(email="u1@pathpilot.ai", password_hash="x", full_name="U1")
    u2 = User(email="u2@pathpilot.ai", password_hash="x", full_name="U2")
    db.add_all([u1, u2])
    db.flush()

    course = Course(
        title="Shared Course",
        description="desc",
        category="Programming",
        difficulty="beginner",
        duration_hours=10,
        provider="PathPilot",
    )
    db.add(course)
    db.flush()
    db.commit()
    return {"u1": u1.id, "u2": u2.id, "course": course.id}


# ── Course progress ──


def test_create_progress():
    db = TestingSessionLocal()
    seed = _seed(db)
    db.close()

    response = client.post(
        "/api/progress/",
        json={"course_id": seed["course_py"], "progress_percentage": 60},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["course_id"] == seed["course_py"]
    assert body["course_title"] == "Python Fundamentals"
    assert body["progress_percentage"] == 60
    assert body["status"] == "in_progress"


def test_update_progress_no_duplicate():
    db = TestingSessionLocal()
    seed = _seed(db)
    db.close()

    client.post("/api/progress/", json={"course_id": seed["course_py"], "progress_percentage": 30})
    client.post("/api/progress/", json={"course_id": seed["course_py"], "progress_percentage": 80})

    data = client.get("/api/progress/").json()
    course_records = [r for r in data if r["course_id"] == seed["course_py"]]
    assert len(course_records) == 1
    assert course_records[0]["progress_percentage"] == 80

    history = client.get("/api/progress/history").json()
    assert len(history) == 2


def test_zero_percent_not_started():
    db = TestingSessionLocal()
    seed = _seed(db)
    db.close()

    body = client.post(
        "/api/progress/", json={"course_id": seed["course_py"], "progress_percentage": 0}
    ).json()
    assert body["status"] == "not_started"


def test_hundred_percent_completed():
    db = TestingSessionLocal()
    seed = _seed(db)
    db.close()

    body = client.post(
        "/api/progress/", json={"course_id": seed["course_py"], "progress_percentage": 100}
    ).json()
    assert body["status"] == "completed"
    assert body["completed_at"] is not None


def test_invalid_percentage_422():
    db = TestingSessionLocal()
    seed = _seed(db)
    db.close()

    response = client.post(
        "/api/progress/", json={"course_id": seed["course_py"], "progress_percentage": 150}
    )
    assert response.status_code == 422

    response = client.post(
        "/api/progress/", json={"course_id": seed["course_py"], "progress_percentage": -5}
    )
    assert response.status_code == 422


def test_invalid_course_404():
    db = TestingSessionLocal()
    _seed(db)
    db.close()

    response = client.post("/api/progress/", json={"course_id": 9999, "progress_percentage": 50})
    assert response.status_code == 404


# ── List / single course ──


def test_get_user_progress():
    db = TestingSessionLocal()
    seed = _seed(db)
    db.close()

    client.post("/api/progress/", json={"course_id": seed["course_py"], "progress_percentage": 100})
    client.post("/api/progress/", json={"course_id": seed["course_ml"], "progress_percentage": 45})

    data = client.get("/api/progress/").json()
    assert len(data) == 2
    assert data[0]["course_title"] == "Python Fundamentals"
    assert data[1]["course_title"] == "Machine Learning"


def test_get_course_progress_existing():
    db = TestingSessionLocal()
    seed = _seed(db)
    db.close()

    client.post("/api/progress/", json={"course_id": seed["course_ml"], "progress_percentage": 45})

    body = client.get(f"/api/progress/{seed['course_ml']}").json()
    assert body["course_id"] == seed["course_ml"]
    assert body["progress_percentage"] == 45
    assert body["status"] == "in_progress"


def test_get_course_progress_none():
    db = TestingSessionLocal()
    seed = _seed(db)
    db.close()

    body = client.get(f"/api/progress/{seed['course_ml']}").json()
    assert body is None


# ── Summary ──


def test_progress_summary():
    db = TestingSessionLocal()
    seed = _seed(db)
    db.close()

    client.post("/api/progress/", json={"course_id": seed["course_py"], "progress_percentage": 100})
    client.post("/api/progress/", json={"course_id": seed["course_ml"], "progress_percentage": 28})

    summary = client.get("/api/progress/summary").json()
    assert summary["total_courses"] == 2
    assert summary["completed_courses"] == 1
    assert summary["in_progress_courses"] == 1
    assert summary["not_started_courses"] == 0
    assert summary["overall_progress_percentage"] == 64.0


# ── Skill improvement ──


def test_skill_progress():
    db = TestingSessionLocal()
    _seed(db)
    db.close()

    data = client.get("/api/progress/skills").json()
    by_skill = {item["skill"]: item for item in data}

    python = by_skill["Python"]
    assert python["initial_score"] == 45
    assert python["latest_score"] == 78
    assert python["improvement"] == 33

    ml = by_skill["Machine Learning"]
    assert ml["initial_score"] == 40
    assert ml["latest_score"] == 65
    assert ml["improvement"] == 25


# ── History ──


def test_progress_history_chronological():
    db = TestingSessionLocal()
    seed = _seed(db)
    db.close()

    client.post("/api/progress/", json={"course_id": seed["course_py"], "progress_percentage": 20})
    client.post("/api/progress/", json={"course_id": seed["course_py"], "progress_percentage": 50})
    client.post("/api/progress/", json={"course_id": seed["course_py"], "progress_percentage": 100})

    history = client.get("/api/progress/history").json()
    percentages = [h["progress_percentage"] for h in history]
    assert percentages == [20, 50, 100]
    assert all("updated_at" in h for h in history)


# ── Isolation (service level, since auth dependency returns the first user) ──


def test_progress_user_isolation():
    from backend.app.services import progress_service

    db = TestingSessionLocal()
    ids = _seed_two_users(db)

    # User 1 records progress on the shared course.
    progress_service.record_course_progress(db, ids["u1"], ids["course"], 100)

    # User 2 should not see user 1's progress.
    u2_progress = progress_service.get_course_progress(db, ids["u2"], ids["course"])
    assert u2_progress is None

    u2_summary = progress_service.get_progress_summary(db, ids["u2"])
    assert u2_summary["total_courses"] == 0

    db.close()
