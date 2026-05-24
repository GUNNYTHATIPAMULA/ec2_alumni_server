from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.dependencies import get_db
from app.schemas.job_schema import CreateJobSchema, JobResponseSchema
from app.services.job_service import (
    create_job_service,
    list_jobs_service,
    list_my_jobs_service,
    delete_job_service,
)
from app.core.security import get_current_user
from app.models.user_model import User
from app.core.roles import UserRole

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("", response_model=JobResponseSchema)
async def create_job(
    data: CreateJobSchema,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.role not in [UserRole.ALUMNI, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Only alumni and admins can post jobs")
    try:
        return await create_job_service(data, current_user.id, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("", response_model=List[JobResponseSchema])
async def list_jobs(
    db: AsyncSession = Depends(get_db),
):
    try:
        return await list_jobs_service(db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/my", response_model=List[JobResponseSchema])
async def list_my_jobs(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        return await list_my_jobs_service(current_user.id, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{job_id}")
async def delete_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        return await delete_job_service(job_id, current_user.id, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
