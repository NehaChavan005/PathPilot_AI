from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Enrollment(Base):
    __tablename__ = "enrollments"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    course_id: Mapped[int] = mapped_column(
        ForeignKey("courses.id", ondelete="CASCADE"),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="enrolled",
        nullable=False,
    )

    enrolled_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="enrollments",
    )

    course = relationship(
        "Course",
        back_populates="enrollments",
    )

    progress = relationship(
        "Progress",
        back_populates="enrollment",
        uselist=False,
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "course_id",
            name="uq_user_course_enrollment",
        ),
    )


STATUS_NOT_STARTED = "not_started"
STATUS_IN_PROGRESS = "in_progress"
STATUS_COMPLETED = "completed"

PROGRESS_STATUSES = (STATUS_NOT_STARTED, STATUS_IN_PROGRESS, STATUS_COMPLETED)


def status_for_percentage(percentage: float) -> str:
    """Derive a progress status from a completion percentage.

    0% -> not_started | 1-99% -> in_progress | 100% -> completed
    """
    if percentage >= 100:
        return STATUS_COMPLETED
    if percentage > 0:
        return STATUS_IN_PROGRESS
    return STATUS_NOT_STARTED


class Progress(Base):
    __tablename__ = "progress"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    enrollment_id: Mapped[int] = mapped_column(
        ForeignKey("enrollments.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

    completion_percentage: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default=STATUS_NOT_STARTED,
        nullable=False,
    )

    time_spent_minutes: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    last_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    started_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    last_accessed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    enrollment = relationship(
        "Enrollment",
        back_populates="progress",
    )


class ProgressHistory(Base):
    """Append-only log of course progress updates for a user."""

    __tablename__ = "progress_history"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    course_id: Mapped[int] = mapped_column(
        ForeignKey("courses.id", ondelete="CASCADE"),
        nullable=False,
    )

    progress_percentage: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


