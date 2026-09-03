from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.api.profile import router as profile_router


app = FastAPI(
    title="PathPilot AI",
    description="Personalized AI-powered learning path platform",
    version="1.0.0"
)


app.include_router(
    auth_router,
    prefix="/api"
)

app.include_router(
    profile_router,
    prefix="/api"
)


@app.get("/")
def root():
    return {
        "message": "PathPilot AI backend is running",
        "authentication": "temporarily disabled"
    }