import os

import pytest
from fastapi.testclient import TestClient

os.environ["DATABASE_URL"] = "sqlite:///./test_pathpilot.db"

from backend.main import app


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c
