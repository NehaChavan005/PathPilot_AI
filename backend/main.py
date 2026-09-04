from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.api.auth import router as auth_router
from app.api.profile import router as profile_router
from app.api.career import router as career_router
from app.api.skills import router as skills_router
from app.api.progress import router as progress_router

# Additional routers
from app.api.assessment import router as assessment_router
from app.api.chat import router as chat_router
from app.api.dashboard import router as dashboard_router
from app.api.feedback import router as feedback_router
from app.api.recommendations import router as recommendations_router
from app.api.roadmap import router as roadmap_router


app = FastAPI(
    title="PathPilot AI",
    description="Personalized AI-powered learning path platform",
    version="1.0.0"
)


# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Existing routers
app.include_router(auth_router, prefix="/api")
app.include_router(profile_router, prefix="/api")
app.include_router(career_router, prefix="/api")
app.include_router(skills_router, prefix="/api")
app.include_router(progress_router, prefix="/api")

# Additional routers
app.include_router(assessment_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(feedback_router, prefix="/api")
app.include_router(recommendations_router, prefix="/api")
app.include_router(roadmap_router, prefix="/api")


@app.get("/health")
def health():
    return {
        "status": "ok"
    }
