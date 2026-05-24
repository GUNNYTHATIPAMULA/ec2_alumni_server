from sqlalchemy import String, Text, Boolean, ForeignKey, Integer
from sqlalchemy.orm import mapped_column, Mapped, relationship
from app.core.database import Base
from app.models.mixins import UUIDMixin, TimestampMixin


class Post(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "posts"

    title: Mapped[str] = mapped_column(String(255))
    content: Mapped[str] = mapped_column(Text)
    author_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    tags: Mapped[str] = mapped_column(String(500), nullable=True)
    image_url: Mapped[str] = mapped_column(String(500), nullable=True)
    like_count: Mapped[int] = mapped_column(Integer, default=0)
