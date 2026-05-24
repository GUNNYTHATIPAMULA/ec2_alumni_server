from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.dependencies import get_db
from app.core.security import get_current_user
from app.core.roles import UserRole
from app.schemas.admin_schema import AdminProfileResponse, AdminProfileUpdate, PendingUserResponse, DashboardStats, AlumniAdminResponse, AlumniDetailResponse
from app.models.user_model import User
from app.models.admin_model import AdminProfile
from app.models.alumni_model import AlumniProfile
from app.models.student_model import StudentProfile
from app.models.event_model import Event
from app.models.post_model import Post

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/profile", response_model=AdminProfileResponse)
async def get_admin_profile(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    result = await db.execute(select(AdminProfile).where(AdminProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return AdminProfileResponse(
        id=str(profile.id), user_id=str(profile.user_id), full_name=profile.full_name,
        designation=profile.designation, department=profile.department,
        office_email=profile.office_email, profile_image=profile.profile_image
    )


@router.put("/profile", response_model=AdminProfileResponse)
async def update_admin_profile(data: AdminProfileUpdate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    result = await db.execute(select(AdminProfile).where(AdminProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)
    await db.commit()
    await db.refresh(profile)
    return AdminProfileResponse(
        id=str(profile.id), user_id=str(profile.user_id), full_name=profile.full_name,
        designation=profile.designation, department=profile.department,
        office_email=profile.office_email, profile_image=profile.profile_image
    )


@router.get("/dashboard", response_model=DashboardStats)
async def get_admin_dashboard(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    alumni_count = (await db.execute(select(func.count(AlumniProfile.id)))).scalar()
    student_count = (await db.execute(select(func.count(StudentProfile.id)))).scalar()
    admin_count = (await db.execute(select(func.count(AdminProfile.id)))).scalar()
    event_count = (await db.execute(select(func.count(Event.id)))).scalar()
    post_count = (await db.execute(select(func.count(Post.id)))).scalar()
    pending = (await db.execute(select(func.count(User.id)).where(User.is_verified == False))).scalar()
    return DashboardStats(
        total_alumni=alumni_count or 0, total_students=student_count or 0,
        total_admins=admin_count or 0, total_events=event_count or 0,
        total_posts=post_count or 0, pending_approvals=pending or 0
    )


@router.get("/pending-users", response_model=List[PendingUserResponse])
async def get_pending_users(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    result = await db.execute(
        select(AlumniProfile, User).join(User, AlumniProfile.user_id == User.id)
        .where(User.is_verified == False).order_by(User.created_at.desc())
    )
    rows = result.all()
    return [
        PendingUserResponse(
            user_id=str(a.AlumniProfile.user_id), full_name=str(a.AlumniProfile.full_name or ''),
            email=str(a.User.email), roll_number=str(a.AlumniProfile.roll_number or ''),
            branch=str(a.AlumniProfile.branch or ''), batch_start_year=a.AlumniProfile.batch_start_year,
            batch_end_year=a.AlumniProfile.batch_end_year, is_verified=bool(a.User.is_verified),
            created_at=a.User.created_at
        )
        for a in rows
    ]


@router.put("/verify-user/{user_id}")
async def verify_user(user_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_verified = True
    await db.commit()
    return {"message": "User verified successfully"}


@router.get("/alumni", response_model=List[AlumniAdminResponse])
async def list_all_alumni(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    result = await db.execute(
        select(AlumniProfile, User).join(User, AlumniProfile.user_id == User.id).order_by(AlumniProfile.full_name)
    )
    rows = result.all()
    return [
        AlumniAdminResponse(
            id=str(a.AlumniProfile.id), user_id=str(a.AlumniProfile.user_id),
            full_name=a.AlumniProfile.full_name, roll_number=a.AlumniProfile.roll_number,
            branch=a.AlumniProfile.branch, degree=a.AlumniProfile.degree,
            batch_start_year=a.AlumniProfile.batch_start_year, batch_end_year=a.AlumniProfile.batch_end_year,
            occupation=a.AlumniProfile.occupation, company_name=a.AlumniProfile.company_name,
            email=a.User.email, is_verified=a.User.is_verified, is_active=a.User.is_active
        )
        for a in rows
    ]


@router.get("/alumni/{user_id}", response_model=AlumniDetailResponse)
async def get_alumni_detail(user_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    result = await db.execute(
        select(AlumniProfile, User).join(User, AlumniProfile.user_id == User.id)
        .where(AlumniProfile.user_id == user_id)
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Alumni not found")
    a, u = row
    return AlumniDetailResponse(
        id=str(a.id), user_id=str(a.user_id), full_name=a.full_name,
        roll_number=a.roll_number, branch=a.branch, degree=a.degree,
        batch_start_year=a.batch_start_year, batch_end_year=a.batch_end_year,
        occupation=a.occupation, company_name=a.company_name,
        current_location=a.current_location, linkedin_url=a.linkedin_url,
        github_url=a.github_url, profile_image=a.profile_image, bio=a.bio,
        mentorship_available=a.mentorship_available, email=u.email,
        phone_number=u.phone_number, username=u.username,
        is_verified=u.is_verified, is_active=u.is_active, created_at=u.created_at
    )


@router.patch("/block-user/{user_id}")
async def toggle_block_user(user_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    await db.commit()
    return {"is_active": user.is_active, "message": f"User {'unblocked' if user.is_active else 'blocked'} successfully"}
