from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.database.base import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

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

    goal_similarity: Mapped[float] = mapped_column(
        Float,
        default=0.0,
    )

    skill_gap_match: Mapped[float] = mapped_column(
        Float,
        default=0.0,
    )

    prerequisite_fit: Mapped[float] = mapped_column(
        Float,
        default=0.0,
    )

    difficulty_fit: Mapped[float] = mapped_column(
        Float,
        default=0.0,
    )

    preference_match: Mapped[float] = mapped_column(
        Float,
        default=0.0,
    )

    collaborative_score: Mapped[float] = mapped_column(
        Float,
        default=0.0,
    )

    final_score: Mapped[float] = mapped_column(
        Float,
        default=0.0,
    )

    explanation: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
    )

    user = relationship(
        "User",
        back_populates="recommendations",
    )

    course = relationship("Course")
