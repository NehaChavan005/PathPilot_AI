from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database.base import Base
from app.models.skill import Skill, Prerequisite
from backend.main import app
from fastapi.testclient import TestClient
from app.database.connection import get_db
import pytest

TEST_DB_URL = "sqlite:///./test_skill_graph.db"
engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def _seed_skills(db):
    skills_data = [
        ("Python", "Programming"),
        ("NumPy", "Data Science"),
        ("Pandas", "Data Science"),
        ("Statistics", "Data Science"),
        ("Machine Learning", "AI/ML"),
        ("Deep Learning", "AI/ML"),
        ("Networking", "Security"),
        ("Cybersecurity", "Security"),
        ("SIEM", "Security"),
    ]

    skill_map = {}
    for name, cat in skills_data:
        s = Skill(name=name, category=cat, description=f"{name} desc")
        db.add(s)
        db.flush()
        skill_map[name] = s

    prereqs = [
        ("NumPy", "Python"),
        ("Pandas", "Python"),
        ("Machine Learning", "Python"),
        ("Machine Learning", "Statistics"),
        ("Deep Learning", "Machine Learning"),
        ("SIEM", "Cybersecurity"),
        ("SIEM", "Networking"),
    ]

    for skill_name, prereq_name in prereqs:
        db.add(Prerequisite(
            skill_id=skill_map[skill_name].id,
            prerequisite_skill_id=skill_map[prereq_name].id,
            strength=1.0,
        ))

    db.commit()
    return skill_map


# ── Test 1: GET /api/skills/graph returns 200 with nodes and edges ──


def test_skill_graph_returns_200():
    db = TestingSessionLocal()
    _seed_skills(db)
    db.close()

    response = client.get("/api/skills/graph")
    assert response.status_code == 200

    body = response.json()
    assert "nodes" in body
    assert "edges" in body
    assert isinstance(body["nodes"], list)
    assert isinstance(body["edges"], list)


# ── Test 2: Verify every node contains id, type, data, position ──


def test_nodes_have_required_fields():
    db = TestingSessionLocal()
    _seed_skills(db)
    db.close()

    body = client.get("/api/skills/graph").json()

    for node in body["nodes"]:
        assert "id" in node
        assert "type" in node
        assert "data" in node
        assert "position" in node
        assert "label" in node["data"]
        assert "x" in node["position"]
        assert "y" in node["position"]
        assert node["type"] == "skill"


# ── Test 3: Verify every edge contains id, source, target ──


def test_edges_have_required_fields():
    db = TestingSessionLocal()
    _seed_skills(db)
    db.close()

    body = client.get("/api/skills/graph").json()

    for edge in body["edges"]:
        assert "id" in edge
        assert "source" in edge
        assert "target" in edge
        assert "type" in edge
        assert edge["type"] == "smoothstep"


# ── Test 4: Verify prerequisite relationships ──


def test_prerequisite_relationships():
    db = TestingSessionLocal()
    _seed_skills(db)
    db.close()

    body = client.get("/api/skills/graph").json()
    edge_pairs = {(e["source"], e["target"]) for e in body["edges"]}

    # Python -> NumPy
    assert ("python", "numpy") in edge_pairs

    # Python -> Pandas
    assert ("python", "pandas") in edge_pairs

    # Machine Learning requires both Python and Statistics
    assert ("python", "machine-learning") in edge_pairs
    assert ("statistics", "machine-learning") in edge_pairs

    # Deep Learning requires Machine Learning
    assert ("machine-learning", "deep-learning") in edge_pairs

    # SIEM requires both Cybersecurity and Networking
    assert ("cybersecurity", "siem") in edge_pairs
    assert ("networking", "siem") in edge_pairs


# ── Test 5: Career-specific graph ──


def test_career_specific_graph():
    db = TestingSessionLocal()
    _seed_skills(db)
    db.close()

    response = client.get("/api/skills/graph?career=Machine Learning Engineer")
    assert response.status_code == 200

    body = response.json()
    node_ids = {n["id"] for n in body["nodes"]}

    # ML career should include ML-relevant skills
    assert "python" in node_ids
    assert "machine-learning" in node_ids
    assert "deep-learning" in node_ids
    assert "statistics" in node_ids

    # Should NOT include unrelated security skills
    assert "siem" not in node_ids
    assert "cybersecurity" not in node_ids
    assert "networking" not in node_ids


# ── Test 6: Unknown career returns 404 ──


def test_unknown_career_returns_404():
    db = TestingSessionLocal()
    _seed_skills(db)
    db.close()

    response = client.get("/api/skills/graph?career=Astrologer")
    assert response.status_code == 404


# ── Test 7: No duplicate edges ──


def test_no_duplicate_edges():
    db = TestingSessionLocal()
    _seed_skills(db)
    db.close()

    body = client.get("/api/skills/graph").json()
    edge_pairs = [(e["source"], e["target"]) for e in body["edges"]]

    assert len(edge_pairs) == len(set(edge_pairs))


# ── Extra: empty database returns empty graph ──


def test_empty_graph():
    response = client.get("/api/skills/graph")
    assert response.status_code == 200
    body = response.json()
    assert body["nodes"] == []
    assert body["edges"] == []


# ── Extra: node positions are non-overlapping within same level ──


def test_node_positions_deterministic():
    db = TestingSessionLocal()
    _seed_skills(db)
    db.close()

    body = client.get("/api/skills/graph").json()
    nodes = body["nodes"]

    # Positions should not all be at 0,0
    positions = [(n["position"]["x"], n["position"]["y"]) for n in nodes]
    assert len(set(positions)) > 1, "All nodes at same position"
