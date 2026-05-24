from pydantic import BaseModel
from datetime import datetime


class AdminProfileResponse(BaseModel):
    id: str
    user_id: str
    full_name: str
    designation: str | None = None
    department: str | None = None
    office_email: str | None = None
    profile_image: str | None = None


class AdminProfileUpdate(BaseModel):
    full_name: str | None = None
    designation: str | None = None
    department: str | None = None
    profile_image: str | None = None


class PendingUserResponse(BaseModel):
    user_id: str
    full_name: str | None = None
    email: str
    roll_number: str | None = None
    branch: str | None = None
    batch_start_year: int | None = None
    batch_end_year: int | None = None
    is_verified: bool
    created_at: datetime | None = None


class DashboardStats(BaseModel):
    total_alumni: int
    total_students: int
    total_admins: int
    total_events: int
    total_posts: int
    pending_approvals: int


class AlumniAdminResponse(BaseModel):
    id: str
    user_id: str
    full_name: str
    roll_number: str
    branch: str
    degree: str
    batch_start_year: int | None = None
    batch_end_year: int | None = None
    occupation: str | None = None
    company_name: str | None = None
    email: str
    is_verified: bool
    is_active: bool


class AlumniDetailResponse(BaseModel):
    id: str
    user_id: str
    full_name: str
    roll_number: str
    branch: str
    degree: str
    batch_start_year: int | None = None
    batch_end_year: int | None = None
    occupation: str | None = None
    company_name: str | None = None
    current_location: str | None = None
    linkedin_url: str | None = None
    github_url: str | None = None
    profile_image: str | None = None
    bio: str | None = None
    mentorship_available: bool = False
    email: str
    phone_number: str | None = None
    username: str
    is_verified: bool
    is_active: bool
    created_at: datetime | None = None
