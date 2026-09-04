import sys
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI

from backend.app.api.auth import router as auth_router
from backend.app.api.profile import router as profile_router
from backend.app.api.career import router as career_router
from backend.app.api.skills import router as skills_router
from backend.app.api.progress import router as progress_router


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


@app.get("/health")
def health():
    return {
        "message": "PathPilot AI backend is running"
    }
