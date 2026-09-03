from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.database.base import Base


class LearnerProfile(Base):
    __tablename__ = "learner_profiles"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

    target_role: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    experience_level: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    education: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    interests: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    preferences: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    weekly_hours: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    user = relationship(
        "User",
        back_populates="profile",
    )
