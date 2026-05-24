from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class AddEventImageSchema(BaseModel):
    image_url: str
    caption: Optional[str] = None


class EventImageResponseSchema(BaseModel):
    id: UUID
    event_id: UUID
    image_url: str
    caption: Optional[str] = None

    class Config:
        from_attributes = True
