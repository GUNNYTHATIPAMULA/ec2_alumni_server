from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional


class CreateEventSchema(BaseModel):
    title: str
    description: str
    date: datetime
    location: Optional[str] = None
    venue: Optional[str] = None
    max_participants: Optional[int] = None
    image_url: Optional[str] = None

    @field_validator("date", mode="after")
    @classmethod
    def strip_timezone(cls, v: datetime) -> datetime:
        if v.tzinfo is not None:
            return v.replace(tzinfo=None)
        return v
