from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.dependencies import get_db
from app.core.security import get_current_user
from app.models.user_model import User
from app.models.mentorship_model import MentorshipRequest

router = APIRouter(prefix="/mentorship", tags=["Mentorship"])


@router.post("/request/{mentor_id}")
async def request_mentorship(
    mentor_id: str, message: str = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    existing = await db.execute(
        select(MentorshipRequest).where(
            MentorshipRequest.mentor_id == mentor_id,
            MentorshipRequest.mentee_id == current_user.id,
            MentorshipRequest.status == "pending"
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Mentorship request already pending")
    req = MentorshipRequest(mentor_id=mentor_id, mentee_id=current_user.id, message=message)
    db.add(req)
    await db.commit()
    return {"message": "Mentorship request sent"}


@router.get("/requests")
async def get_mentorship_requests(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(MentorshipRequest).where(
            (MentorshipRequest.mentor_id == current_user.id) |
            (MentorshipRequest.mentee_id == current_user.id)
        ).order_by(MentorshipRequest.created_at.desc())
    )
    requests = result.scalars().all()
    return [
        {
            "id": str(r.id), "mentor_id": str(r.mentor_id),
            "mentee_id": str(r.mentee_id), "message": r.message,
            "status": r.status, "created_at": r.created_at.isoformat()
        }
        for r in requests
    ]


@router.put("/request/{request_id}")
async def update_mentorship_request(
    request_id: str, status: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if status not in ["accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.execute(select(MentorshipRequest).where(MentorshipRequest.id == request_id))
    req = result.scalar_one_or_none()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if str(req.mentor_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Only the mentor can respond")
    req.status = status
    await db.commit()
    return {"message": f"Mentorship request {status}"}
