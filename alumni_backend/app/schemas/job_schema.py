from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class CreateJobSchema(BaseModel):
    title: str
    company: str
    location: str
    description: str
    requirements: Optional[str] = None
    employment_type: Optional[str] = "full-time"
    experience_level: Optional[str] = None
    salary_range: Optional[str] = None
    application_deadline: Optional[str] = None
    contact_email: Optional[str] = None


class JobResponseSchema(BaseModel):
    id: UUID
    title: str
    company: str
    location: str
    description: str
    requirements: Optional[str] = None
    employment_type: str
    experience_level: Optional[str] = None
    salary_range: Optional[str] = None
    application_deadline: Optional[str] = None
    contact_email: Optional[str] = None
    is_active: bool
    posted_by_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
