from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.dependencies import get_db
from app.core.security import get_current_user
from app.core.roles import UserRole
from app.schemas.student_schema import StudentProfileResponse, StudentProfileUpdate
from app.models.user_model import User
from app.models.student_model import StudentProfile

router = APIRouter(prefix="/student", tags=["Student"])


@router.get("/profile", response_model=StudentProfileResponse)
async def get_student_profile(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Student access required")
    result = await db.execute(select(StudentProfile).where(StudentProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return StudentProfileResponse(
        id=str(profile.id), user_id=str(profile.user_id), full_name=profile.full_name,
        roll_number=profile.roll_number, branch=profile.branch, degree=profile.degree,
        batch_start_year=profile.batch_start_year, batch_end_year=profile.batch_end_year,
        current_semester=profile.current_semester, linkedin_url=profile.linkedin_url,
        github_url=profile.github_url, profile_image=profile.profile_image, bio=profile.bio
    )


@router.put("/profile", response_model=StudentProfileResponse)
async def update_student_profile(data: StudentProfileUpdate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Student access required")
    result = await db.execute(select(StudentProfile).where(StudentProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)
    await db.commit()
    await db.refresh(profile)
    return StudentProfileResponse(
        id=str(profile.id), user_id=str(profile.user_id), full_name=profile.full_name,
        roll_number=profile.roll_number, branch=profile.branch, degree=profile.degree,
        batch_start_year=profile.batch_start_year, batch_end_year=profile.batch_end_year,
        current_semester=profile.current_semester, linkedin_url=profile.linkedin_url,
        github_url=profile.github_url, profile_image=profile.profile_image, bio=profile.bio
    )


@router.get("/directory", response_model=List[StudentProfileResponse])
async def get_student_directory(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StudentProfile).order_by(StudentProfile.full_name))
    profiles = result.scalars().all()
    return [
        StudentProfileResponse(
            id=str(p.id), user_id=str(p.user_id), full_name=p.full_name,
            roll_number=p.roll_number, branch=p.branch, degree=p.degree,
            batch_start_year=p.batch_start_year, batch_end_year=p.batch_end_year,
            current_semester=p.current_semester, linkedin_url=p.linkedin_url,
            github_url=p.github_url, profile_image=p.profile_image, bio=p.bio
        )
        for p in profiles
    ]
