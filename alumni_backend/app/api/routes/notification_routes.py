from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.dependencies import get_db
from app.core.security import get_current_user
from app.models.user_model import User
from app.models.notification_model import Notification

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("")
async def get_notifications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Notification).where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
    )
    notifications = result.scalars().all()
    return [
        {
            "id": str(n.id), "title": n.title, "message": n.message,
            "type": n.type, "is_read": n.is_read, "link": n.link,
            "created_at": n.created_at.isoformat()
        }
        for n in notifications
    ]


@router.put("/{notification_id}/read")
async def mark_as_read(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Notification).where(Notification.id == notification_id))
    notification = result.scalar_one_or_none()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    if str(notification.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized")
    notification.is_read = True
    await db.commit()
    return {"message": "Notification marked as read"}
