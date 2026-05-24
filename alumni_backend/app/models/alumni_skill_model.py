from sqlalchemy import (
    String,
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


class AlumniSkill(
    Base,
    UUIDMixin,
    TimestampMixin
):

    __tablename__ = "alumni_skills"

    alumni_id: Mapped[str] = mapped_column(
        ForeignKey("alumni_profiles.id")
    )

    skill_name: Mapped[str] = mapped_column(
        String(100)
    )