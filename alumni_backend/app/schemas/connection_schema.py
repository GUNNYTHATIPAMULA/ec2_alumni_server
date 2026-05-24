from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class ConnectionResponseSchema(BaseModel):

    id: UUID

    sender_id: UUID

    receiver_id: UUID

    status: str

    created_at: datetime

    updated_at: datetime

    class Config:
        from_attributes = True


class ConnectionUpdateSchema(BaseModel):

    status: str  # accepted or rejected
