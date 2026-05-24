from sqlalchemy import (
    String,
    Float,
    ForeignKey
)
from sqlalchemy.orm import (
    mapped_column,
    Mapped,
    relationship
)

from app.core.database import Base
from app.models.mixins import (
    UUIDMixin,
    TimestampMixin
)


class Contribution(
    Base,
    UUIDMixin,
    TimestampMixin
):

    __tablename__ = "contributions"

    alumni_id: Mapped[str] = mapped_column(
        ForeignKey("users.id")
    )

    amount: Mapped[float] = mapped_column(
        Float
    )

    purpose: Mapped[str] = mapped_column(
        String(255)
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="completed"
    )

    alumni = relationship("User")
