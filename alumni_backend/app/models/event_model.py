from sqlalchemy import String, Integer, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship
from datetime import datetime
from app.core.database import Base
from app.models.mixins import UUIDMixin, TimestampMixin


class Event(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "events"

    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text, nullable=True)
    event_date: Mapped[datetime] = mapped_column(DateTime)
    location: Mapped[str] = mapped_column(String(255), nullable=True)
    venue: Mapped[str] = mapped_column(String(255), nullable=True)
    max_participants: Mapped[int] = mapped_column(Integer, nullable=True)
    registration_deadline: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_by: Mapped[str] = mapped_column(ForeignKey("users.id"))


class EventRegistration(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "event_registrations"

    event_id: Mapped[str] = mapped_column(ForeignKey("events.id"))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    status: Mapped[str] = mapped_column(String(50), default="registered")
