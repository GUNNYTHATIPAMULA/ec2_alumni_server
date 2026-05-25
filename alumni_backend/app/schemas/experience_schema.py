from pydantic import BaseModel


class AddExperienceSchema(BaseModel):
    company_name: str
    role: str
    start_year: int
    end_year: int | None = None
    description: str | None = None


class ExperienceResponseSchema(BaseModel):
    id: str
    alumni_id: str
    company_name: str
    role: str
    start_year: int
    end_year: int | None = None
    description: str | None = None

    class Config:
        from_attributes = True
