from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped
from app.core.database import Base
from app.models.mixins import UUIDMixin, TimestampMixin


class Connection(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "connections"

    sender_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    receiver_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    status: Mapped[str] = mapped_column(String(50), default="pending")
