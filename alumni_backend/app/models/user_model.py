from datetime import datetime

from sqlalchemy import (
    String,
    Boolean,
    Enum,
    DateTime
)

from sqlalchemy.orm import mapped_column, Mapped

from app.core.database import Base
from app.core.roles import UserRole
from app.models.mixins import UUIDMixin, TimestampMixin


class User(Base, UUIDMixin, TimestampMixin):

    __tablename__ = "users"

    username: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True
    )

    phone_number: Mapped[str] = mapped_column(
        String(15),
        unique=True
    )

    hashed_password: Mapped[str] = mapped_column(String)

    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole)
    )

    # Verification

    email_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    phone_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )

    email_otp: Mapped[str] = mapped_column(
        String(10),
        nullable=True
    )

    phone_otp: Mapped[str] = mapped_column(
        String(10),
        nullable=True
    )

    otp_expiry: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=True
    )

    # Account Status

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True
    )

    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )