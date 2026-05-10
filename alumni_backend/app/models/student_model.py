# app/models/student_model.py

from sqlalchemy import (
    String,
    Integer,
    ForeignKey
)

from sqlalchemy.orm import (
    mapped_column,
    Mapped,
    relationship
)

from app.core.database import Base
from app.models.mixins import UUIDMixin, TimestampMixin


class StudentProfile(Base, UUIDMixin, TimestampMixin):

    __tablename__ = "student_profiles"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"),
        unique=True
    )

    full_name: Mapped[str] = mapped_column(
        String(255)
    )

    roll_number: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        index=True
    )

    branch: Mapped[str] = mapped_column(
        String(100)
    )

    degree: Mapped[str] = mapped_column(
        String(100)
    )

    batch_start_year: Mapped[int] = mapped_column(
        Integer
    )

    batch_end_year: Mapped[int] = mapped_column(
        Integer
    )

    current_semester: Mapped[int] = mapped_column(
        Integer,
        nullable=True
    )

    skills: Mapped[str] = mapped_column(
        String(1000),
        nullable=True
    )

    interests: Mapped[str] = mapped_column(
        String(1000),
        nullable=True
    )

    linkedin_url: Mapped[str] = mapped_column(
        String(500),
        nullable=True
    )

    github_url: Mapped[str] = mapped_column(
        String(500),
        nullable=True
    )

    resume_url: Mapped[str] = mapped_column(
        String(500),
        nullable=True
    )

    bio: Mapped[str] = mapped_column(
        String(1000),
        nullable=True
    )

    profile_image: Mapped[str] = mapped_column(
        String(500),
        nullable=True
    )

    user = relationship("User")