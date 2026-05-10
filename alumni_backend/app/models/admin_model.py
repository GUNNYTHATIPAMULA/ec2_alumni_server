# app/models/admin_model.py

from sqlalchemy import (
    String,
    ForeignKey
)

from sqlalchemy.orm import (
    mapped_column,
    Mapped,
    relationship
)

from app.core.database import Base
from app.models.mixins import UUIDMixin, TimestampMixin


class AdminProfile(Base, UUIDMixin, TimestampMixin):

    __tablename__ = "admin_profiles"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"),
        unique=True
    )

    full_name: Mapped[str] = mapped_column(
        String(255)
    )

    designation: Mapped[str] = mapped_column(
        String(255),
        nullable=True
    )

    department: Mapped[str] = mapped_column(
        String(100),
        nullable=True
    )

    office_email: Mapped[str] = mapped_column(
        String(255),
        nullable=True
    )

    profile_image: Mapped[str] = mapped_column(
        String(500),
        nullable=True
    )

    user = relationship("User")