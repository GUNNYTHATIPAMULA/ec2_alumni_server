from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped

from app.core.database import Base
from app.models.mixins import UUIDMixin, TimestampMixin


class AlumniEducation(Base, UUIDMixin, TimestampMixin):

    __tablename__ = "alumni_education"

    alumni_id: Mapped[str] = mapped_column(
        ForeignKey("alumni_profiles.id")
    )

    degree: Mapped[str] = mapped_column(String(255))

    institution: Mapped[str] = mapped_column(String(255))

    field_of_study: Mapped[str] = mapped_column(String(255), nullable=True)

    start_year: Mapped[int] = mapped_column(Integer)

    end_year: Mapped[int] = mapped_column(Integer, nullable=True)
