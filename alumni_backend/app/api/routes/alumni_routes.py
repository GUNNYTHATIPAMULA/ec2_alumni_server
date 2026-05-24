from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.dependencies import get_db
from app.core.security import get_current_user
from app.core.roles import UserRole
from app.schemas.alumni_schema import AlumniProfileResponse, AlumniProfileUpdate, AlumniListResponse
from app.models.user_model import User
from app.models.alumni_model import AlumniProfile

router = APIRouter(prefix="/alumni", tags=["Alumni"])


@router.get("/profile", response_model=AlumniProfileResponse)
async def get_profile(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != UserRole.ALUMNI:
        raise HTTPException(status_code=403, detail="Alumni access required")
    result = await db.execute(select(AlumniProfile).where(AlumniProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return AlumniProfileResponse(
        id=str(profile.id), user_id=str(profile.user_id), full_name=profile.full_name,
        roll_number=profile.roll_number, branch=profile.branch, degree=profile.degree,
        batch_start_year=profile.batch_start_year, batch_end_year=profile.batch_end_year,
        occupation=profile.occupation, company_name=profile.company_name,
        current_location=profile.current_location, linkedin_url=profile.linkedin_url,
        github_url=profile.github_url, profile_image=profile.profile_image,
        bio=profile.bio, mentorship_available=profile.mentorship_available
    )


@router.put("/profile", response_model=AlumniProfileResponse)
async def update_profile(data: AlumniProfileUpdate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != UserRole.ALUMNI:
        raise HTTPException(status_code=403, detail="Alumni access required")
    result = await db.execute(select(AlumniProfile).where(AlumniProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)
    await db.commit()
    await db.refresh(profile)
    return AlumniProfileResponse(
        id=str(profile.id), user_id=str(profile.user_id), full_name=profile.full_name,
        roll_number=profile.roll_number, branch=profile.branch, degree=profile.degree,
        batch_start_year=profile.batch_start_year, batch_end_year=profile.batch_end_year,
        occupation=profile.occupation, company_name=profile.company_name,
        current_location=profile.current_location, linkedin_url=profile.linkedin_url,
        github_url=profile.github_url, profile_image=profile.profile_image,
        bio=profile.bio, mentorship_available=profile.mentorship_available
    )


@router.get("/directory", response_model=List[AlumniListResponse])
async def get_alumni_directory(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(AlumniProfile).order_by(AlumniProfile.full_name)
    )
    profiles = result.scalars().all()
    return [
        AlumniListResponse(
            id=str(p.id), full_name=p.full_name, roll_number=p.roll_number,
            branch=p.branch, batch_start_year=p.batch_start_year, batch_end_year=p.batch_end_year,
            occupation=p.occupation, company_name=p.company_name, profile_image=p.profile_image
        )
        for p in profiles
    ]


@router.get("/{user_id}", response_model=AlumniListResponse)
async def get_alumni_by_id(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AlumniProfile).where(AlumniProfile.user_id == user_id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Alumni not found")
    return AlumniListResponse(
        id=str(profile.id), full_name=profile.full_name, roll_number=profile.roll_number,
        branch=profile.branch, batch_start_year=profile.batch_start_year, batch_end_year=profile.batch_end_year,
        occupation=profile.occupation, company_name=profile.company_name, profile_image=profile.profile_image
    )
