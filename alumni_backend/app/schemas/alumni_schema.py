from pydantic import BaseModel


class AlumniProfileResponse(BaseModel):
    id: str
    user_id: str
    full_name: str
    roll_number: str
    branch: str
    degree: str
    batch_start_year: int
    batch_end_year: int
    occupation: str | None = None
    company_name: str | None = None
    current_location: str | None = None
    linkedin_url: str | None = None
    github_url: str | None = None
    profile_image: str | None = None
    bio: str | None = None
    mentorship_available: bool = False


class AlumniProfileUpdate(BaseModel):
    full_name: str | None = None
    roll_number: str | None = None
    branch: str | None = None
    degree: str | None = None
    batch_start_year: int | None = None
    batch_end_year: int | None = None
    occupation: str | None = None
    company_name: str | None = None
    current_location: str | None = None
    linkedin_url: str | None = None
    github_url: str | None = None
    profile_image: str | None = None
    bio: str | None = None
    mentorship_available: bool | None = None


class AlumniListResponse(BaseModel):
    id: str
    user_id: str
    full_name: str
    roll_number: str
    branch: str
    batch_start_year: int
    batch_end_year: int
    occupation: str | None = None
    company_name: str | None = None
    profile_image: str | None = None
    has_experience: bool = False
