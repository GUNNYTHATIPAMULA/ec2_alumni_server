from sqlalchemy import String, Integer, Text, Boolean, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship

from app.core.database import Base
from app.models.mixins import UUIDMixin, TimestampMixin


class Job(Base, UUIDMixin, TimestampMixin):

    __tablename__ = "jobs"

    title: Mapped[str] = mapped_column(String(255))

    company: Mapped[str] = mapped_column(String(255))

    location: Mapped[str] = mapped_column(String(255))

    description: Mapped[str] = mapped_column(Text)

    requirements: Mapped[str] = mapped_column(Text, nullable=True)

    employment_type: Mapped[str] = mapped_column(String(50), default="full-time")

    experience_level: Mapped[str] = mapped_column(String(50), nullable=True)

    salary_range: Mapped[str] = mapped_column(String(100), nullable=True)

    application_deadline: Mapped[str] = mapped_column(String(50), nullable=True)

    contact_email: Mapped[str] = mapped_column(String(255), nullable=True)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    posted_by_id: Mapped[str] = mapped_column(ForeignKey("users.id"))

    posted_by = relationship("User")
