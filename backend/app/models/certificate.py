from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.database.base import Base


class Certificate(Base):
    """Issued learning-path completion certificate."""

    __tablename__ = "certificates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    roadmap_id: Mapped[int] = mapped_column(ForeignKey("learning_paths.id", ondelete="SET NULL"), nullable=True)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    career: Mapped[str] = mapped_column(String(200), nullable=False)
    certificate_code: Mapped[str] = mapped_column(String(80), nullable=False, unique=True)
    issued_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    user = relationship("User")
    roadmap = relationship("LearningPath")
