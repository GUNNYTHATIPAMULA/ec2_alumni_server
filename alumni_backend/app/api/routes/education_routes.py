from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db
from app.schemas.education_schema import AddEducationSchema, EducationResponseSchema
from app.services.education_service import (
    add_education_service,
    list_education_service,
    delete_education_service,
)
from app.core.security import get_current_user
from app.models.user_model import User

router = APIRouter(prefix="/alumni", tags=["Education"])


@router.post("/add-education", response_model=EducationResponseSchema)
async def add_education(
    data: AddEducationSchema,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        result = await add_education_service(current_user.id, data, db)
        return result["education"]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/education", response_model=list[EducationResponseSchema])
async def list_education(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        return await list_education_service(current_user.id, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/education/{edu_id}")
async def delete_education(
    edu_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        return await delete_education_service(edu_id, current_user.id, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
