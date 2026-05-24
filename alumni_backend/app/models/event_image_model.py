from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship

from app.core.database import Base
from app.models.mixins import UUIDMixin, TimestampMixin


class EventImage(Base, UUIDMixin, TimestampMixin):

    __tablename__ = "event_images"

    event_id: Mapped[str] = mapped_column(
        ForeignKey("events.id", ondelete="CASCADE")
    )

    image_url: Mapped[str] = mapped_column(String(500))

    caption: Mapped[str] = mapped_column(String(500), nullable=True)

    event = relationship("Event", backref="images")
