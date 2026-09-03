from .base import Base
from .connection import engine
from app.models import assessment, course, profile, progress, recommendation, roadmap, skill, user, feedback

def create_tables() -> None:
    Base.metadata.create_all(bind=engine)
