import sys
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure the repo root (F:\PathPilot_AI) is importable so the
# ``backend.app`` package resolves regardless of the launch directory.
BACKEND_DIR = Path(__file__).resolve().parent
REPO_ROOT = BACKEND_DIR.parent

if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from backend.app.config.settings import settings
from backend.app.database.init_db import init_db
from backend.app.api import (
    assessment_router,
    auth_router,
    chat_router,
    dashboard_router,
    feedback_router,
    profile_router,
    progress_router,
    recommendations_router,
    roadmap_router,
    skills_router,
)
from backend.app.api.ai import router as ai_router
from backend.app.api.career import router as career_router
from backend.app.api.roleplay import router as roleplay_router


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

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

routers = [
    auth_router,
    profile_router,
    career_router,
    skills_router,
    progress_router,
    recommendations_router,
    roadmap_router,
    assessment_router,
    ai_router,
    chat_router,
    dashboard_router,
    feedback_router,
    roleplay_router,
]

for router in routers:
    app.include_router(router, prefix="/api")


@app.get("/")
def root():
    return {
        "message": "PathPilot AI backend is running",
        "status": "ok",
    }


@app.get("/health")
def health():
    return {"status": "ok"}
