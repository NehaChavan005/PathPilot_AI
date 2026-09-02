from fastapi import FastAPI

app = FastAPI(
    title="PathPilot AI",
    description="AI-powered Personalized Learning Path Recommendation System",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "message": "Welcome to PathPilot AI",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import routers
from app.config.settings import settings
from app.database.init_db import create_tables


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name, version=settings.app_version)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    for router in routers:
        app.include_router(router, prefix=settings.api_prefix)

    @app.on_event("startup")
    def startup() -> None:
        create_tables()

    @app.get("/health", tags=["health"])
    def health() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()
