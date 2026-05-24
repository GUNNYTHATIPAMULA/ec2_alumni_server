from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db
from app.schemas.skill_schema import AddSkillSchema, SkillResponseSchema
from app.services.skill_service import (
    add_skill_service,
    list_skills_service,
    delete_skill_service,
)
from app.core.security import get_current_user
from app.models.user_model import User

router = APIRouter(prefix="/alumni", tags=["Skills"])


@router.post("/add-skill", response_model=SkillResponseSchema)
async def add_skill(
    data: AddSkillSchema,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        result = await add_skill_service(current_user.id, data, db)
        return result["skill"]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/skills", response_model=list[SkillResponseSchema])
async def list_skills(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        return await list_skills_service(current_user.id, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/skills/{skill_id}")
async def delete_skill(
    skill_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        return await delete_skill_service(skill_id, current_user.id, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
