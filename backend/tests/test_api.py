from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_feedback() -> None:
    response = client.post("/api/feedback", json={"message": "Helpful roadmap"})
    assert response.status_code == 200
    assert response.json()["status"] == "received"
