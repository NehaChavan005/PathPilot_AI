from app.database.base import Base
from app.database.connection import engine

# Import all models so SQLAlchemy knows about every table.
from app.models import (
    User,
    LearnerProfile,
    Skill,
    LearnerSkill,
    Prerequisite,
    Course,
    CourseSkill,
    Enrollment,
    Progress,
    ProgressHistory,
    Assessment,
    AssessmentResult,
    Recommendation,
    LearningPath,
    RoadmapItem,
)


def init_db():
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
    print("PathPilot database initialized successfully.")


