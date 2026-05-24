from sqlalchemy import (
    String,
    Integer,
    ForeignKey
)

from sqlalchemy.orm import (
    mapped_column,
    Mapped
)

from app.core.database import Base
from app.models.mixins import (
    UUIDMixin,
    TimestampMixin
)


class AlumniExperience(
    Base,
    UUIDMixin,
    TimestampMixin
):

    __tablename__ = "alumni_experiences"

    alumni_id: Mapped[str] = mapped_column(
        ForeignKey("alumni_profiles.id")
    )

    company_name: Mapped[str] = mapped_column(
        String(255)
    )

    role: Mapped[str] = mapped_column(
        String(255)
    )

    start_year: Mapped[int] = mapped_column(
        Integer
    )

    end_year: Mapped[int] = mapped_column(
        Integer,
        nullable=True
    )

    description: Mapped[str] = mapped_column(
        String(1000),
        nullable=True
    )