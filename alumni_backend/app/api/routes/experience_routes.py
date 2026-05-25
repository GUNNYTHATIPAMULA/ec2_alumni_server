from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db
from app.schemas.experience_schema import AddExperienceSchema, ExperienceResponseSchema
from app.services.experience_service import (
    add_experience_service,
    list_experience_service,
    delete_experience_service,
)
from app.core.security import get_current_user
from app.models.user_model import User

router = APIRouter(prefix="/alumni", tags=["Experience"])


@router.post("/add-experience", response_model=ExperienceResponseSchema)
async def add_experience(
    data: AddExperienceSchema,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        result = await add_experience_service(current_user.id, data, db)
        return result["experience"]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/experience", response_model=list[ExperienceResponseSchema])
async def list_experience(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        return await list_experience_service(current_user.id, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/experience/{exp_id}")
async def delete_experience(
    exp_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        return await delete_experience_service(exp_id, current_user.id, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
