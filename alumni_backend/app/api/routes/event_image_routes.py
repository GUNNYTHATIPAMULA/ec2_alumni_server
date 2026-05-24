from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.dependencies import get_db
from app.schemas.event_image_schema import AddEventImageSchema, EventImageResponseSchema
from app.services.event_image_service import (
    add_event_image_service,
    list_event_images_service,
    delete_event_image_service,
)
from app.core.security import get_current_user
from app.models.user_model import User
from app.core.roles import UserRole

router = APIRouter(prefix="/events", tags=["Event Images"])


@router.post("/{event_id}/images", response_model=EventImageResponseSchema)
async def add_event_image(
    event_id: str,
    data: AddEventImageSchema,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    try:
        return await add_event_image_service(event_id, data, current_user.id, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{event_id}/images", response_model=List[EventImageResponseSchema])
async def list_event_images(
    event_id: str,
    db: AsyncSession = Depends(get_db),
):
    try:
        return await list_event_images_service(event_id, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/images/{image_id}")
async def delete_event_image(
    image_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    try:
        return await delete_event_image_service(image_id, db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
