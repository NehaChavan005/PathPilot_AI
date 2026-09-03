import sys
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI

# Ensure the repo root (F:\PathPilot_AI) is importable so the
# ``backend.app`` package resolves regardless of the launch directory.
BACKEND_DIR = Path(__file__).resolve().parent
REPO_ROOT = BACKEND_DIR.parent

if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from backend.app.api.auth import router as auth_router
from backend.app.api.profile import router as profile_router
from backend.app.api.career import router as career_router
from backend.app.api.skills import router as skills_router
from backend.app.api.progress import router as progress_router
from backend.app.database.init_db import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all database tables at startup before handling requests.
    init_db()
    yield


app = FastAPI(
    title="PathPilot AI",
    description="Personalized AI-powered learning path platform",
    version="1.0.0",
    lifespan=lifespan,
)


app.include_router(
    auth_router,
    prefix="/api"
)

app.include_router(
    profile_router,
    prefix="/api"
)

app.include_router(
    career_router,
    prefix="/api"
)

app.include_router(
    skills_router,
    prefix="/api"
)

app.include_router(
    progress_router,
    prefix="/api"
)


@app.get("/")
def root():
    return {
        "message": "PathPilot AI backend is running"
    }
