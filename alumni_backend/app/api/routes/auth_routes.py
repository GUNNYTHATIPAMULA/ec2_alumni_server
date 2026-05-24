from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db
from app.core.security import create_access_token, get_current_user
from app.core.roles import UserRole
from app.utils.password_utils import hash_password, verify_password
from app.schemas.auth_schema import (
    AdminRegisterSchema, AlumniRegisterSchema, StudentRegisterSchema,
    LoginSchema, TokenResponse
)
from app.models.user_model import User
from app.models.admin_model import AdminProfile
from app.models.alumni_model import AlumniProfile
from app.models.student_model import StudentProfile

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).where(User.username == data.username)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")

    full_name = None
    if user.role == UserRole.ADMIN:
        profile_result = await db.execute(select(AdminProfile).where(AdminProfile.user_id == user.id))
        profile = profile_result.scalar_one_or_none()
        full_name = profile.full_name if profile else None
    elif user.role == UserRole.ALUMNI:
        profile_result = await db.execute(select(AlumniProfile).where(AlumniProfile.user_id == user.id))
        profile = profile_result.scalar_one_or_none()
        full_name = profile.full_name if profile else None
    elif user.role == UserRole.STUDENT:
        profile_result = await db.execute(select(StudentProfile).where(StudentProfile.user_id == user.id))
        profile = profile_result.scalar_one_or_none()
        full_name = profile.full_name if profile else None

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return TokenResponse(
        access_token=token,
        user_id=str(user.id),
        role=user.role.value,
        full_name=full_name
    )


@router.post("/register-admin")
async def register_admin(data: AdminRegisterSchema, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where((User.email == data.email) | (User.username == data.username)))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email or username already exists")
    user = User(
        username=data.username, email=data.email, phone_number=data.phone_number,
        hashed_password=hash_password(data.password), role=UserRole.ADMIN, is_verified=True
    )
    db.add(user)
    await db.flush()
    profile = AdminProfile(user_id=user.id, full_name=data.full_name, designation=data.designation, department=data.department)
    db.add(profile)
    await db.commit()
    return {"message": "Admin registered successfully"}


@router.post("/register-alumni")
async def register_alumni(data: AlumniRegisterSchema, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where((User.email == data.email) | (User.username == data.username)))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email or username already exists")
    user = User(
        username=data.username, email=data.email, phone_number=data.phone_number,
        hashed_password=hash_password(data.password), role=UserRole.ALUMNI, is_verified=True
    )
    db.add(user)
    await db.flush()
    profile = AlumniProfile(
        user_id=user.id, full_name=data.full_name, roll_number=data.roll_number,
        branch=data.branch, degree=data.degree, batch_start_year=data.batch_start_year,
        batch_end_year=data.batch_end_year, occupation=data.occupation, company_name=data.company_name
    )
    db.add(profile)
    await db.commit()
    return {"message": "Alumni registered successfully"}


@router.post("/register-student")
async def register_student(data: StudentRegisterSchema, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where((User.email == data.email) | (User.username == data.username)))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email or username already exists")
    user = User(
        username=data.username, email=data.email, phone_number=data.phone_number,
        hashed_password=hash_password(data.password), role=UserRole.STUDENT, is_verified=True
    )
    db.add(user)
    await db.flush()
    profile = StudentProfile(
        user_id=user.id, full_name=data.full_name, roll_number=data.roll_number,
        branch=data.branch, degree=data.degree, batch_start_year=data.batch_start_year,
        batch_end_year=data.batch_end_year, current_semester=data.current_semester
    )
    db.add(profile)
    await db.commit()
    return {"message": "Student registered successfully"}


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role.value,
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified
    }
