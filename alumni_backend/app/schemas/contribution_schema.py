from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class ContributionCreateSchema(BaseModel):

    amount: float

    purpose: str


class ContributionResponseSchema(BaseModel):

    id: UUID

    alumni_id: UUID

    amount: float

    purpose: str

    status: str

    created_at: datetime

    class Config:
        from_attributes = True
