from datetime import datetime

from pydantic import BaseModel, Field


class ProgressCreate(BaseModel):
    """Payload for recording or updating course progress."""

    course_id: int
    progress_percentage: float = Field(ge=0, le=100)


class CourseProgressRead(BaseModel):
    """A single course progress record for the current user."""

    course_id: int
    course_title: str
    progress_percentage: float
    status: str


class ProgressRead(CourseProgressRead):
    """Full progress record including timestamps."""

    started_at: datetime | None = None
    completed_at: datetime | None = None
    last_accessed_at: datetime | None = None
    updated_at: datetime | None = None


class ProgressSummary(BaseModel):
    total_courses: int
    completed_courses: int
    in_progress_courses: int
    not_started_courses: int
    overall_progress_percentage: float


class SkillProgress(BaseModel):
    skill: str
    initial_score: float
    latest_score: float
    improvement: float


class ProgressHistoryItem(BaseModel):
    course_id: int
    progress_percentage: float
    updated_at: datetime
