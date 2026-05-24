from pydantic import BaseModel
from typing import Optional
from uuid import UUID


class AddEducationSchema(BaseModel):
    degree: str
    institution: str
    field_of_study: Optional[str] = None
    start_year: int
    end_year: Optional[int] = None


class EducationResponseSchema(BaseModel):
    id: UUID
    degree: str
    institution: str
    field_of_study: Optional[str] = None
    start_year: int
    end_year: Optional[int] = None

    class Config:
        from_attributes = True
