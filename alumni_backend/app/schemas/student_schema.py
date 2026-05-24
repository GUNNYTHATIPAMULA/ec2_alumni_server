from pydantic import BaseModel


class StudentProfileResponse(BaseModel):
    id: str
    user_id: str
    full_name: str
    roll_number: str
    branch: str
    degree: str
    batch_start_year: int
    batch_end_year: int
    current_semester: int | None = None
    linkedin_url: str | None = None
    github_url: str | None = None
    profile_image: str | None = None
    bio: str | None = None


class StudentProfileUpdate(BaseModel):
    full_name: str | None = None
    current_semester: int | None = None
    linkedin_url: str | None = None
    github_url: str | None = None
    profile_image: str | None = None
    bio: str | None = None
