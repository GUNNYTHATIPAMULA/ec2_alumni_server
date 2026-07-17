from pydantic import BaseModel, EmailStr, Field


class AdminRegisterSchema(BaseModel):
    full_name: str
    username: str
    email: EmailStr
    phone_number: str
    password: str = Field(min_length=6, max_length=32)
    designation: str | None = None
    department: str | None = None


class AlumniRegisterSchema(BaseModel):
    full_name: str
    username: str
    email: EmailStr
    phone_number: str
    password: str = Field(min_length=6, max_length=32)
    roll_number: str
    branch: str
    degree: str
    batch_start_year: int
    batch_end_year: int
    occupation: str | None = None
    company_name: str | None = None
    profile_image: str | None = None


class StudentRegisterSchema(BaseModel):
    full_name: str
    username: str
    email: EmailStr
    phone_number: str
    password: str = Field(min_length=6, max_length=32)
    roll_number: str
    branch: str
    degree: str
    batch_start_year: int
    batch_end_year: int
    current_semester: int | None = None


class LoginSchema(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    role: str
    full_name: str | None = None


class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    role: str
    is_active: bool
    is_verified: bool


class SendEmailOtpSchema(BaseModel):
    email: EmailStr
    phone_number: str | None = None


class VerifyEmailOtpSchema(BaseModel):
    email: EmailStr
    otp: str


class SendPhoneOtpSchema(BaseModel):
    phone_number: str
    email: str | None = None


class VerifyPhoneOtpSchema(BaseModel):
    phone_number: str
    otp: str
