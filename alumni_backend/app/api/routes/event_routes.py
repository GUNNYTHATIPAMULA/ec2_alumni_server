from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime

from app.core.dependencies import get_db
from app.core.security import get_current_user
from app.core.roles import UserRole
from app.models.user_model import User
from app.models.alumni_model import AlumniProfile
from app.models.event_model import Event, EventRegistration
from app.schemas.event_schema import CreateEventSchema

router = APIRouter(prefix="/events", tags=["Events"])


@router.get("")
async def list_events(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Event).where(Event.is_active == True).order_by(Event.event_date.desc()))
    events = result.scalars().all()
    return [
        {
            "id": str(e.id), "title": e.title, "description": e.description,
            "event_date": e.event_date.isoformat(), "location": e.location,
            "venue": e.venue, "image_url": e.image_url, "is_active": e.is_active,
            "created_at": e.created_at.isoformat()
        }
        for e in events
    ]


@router.post("")
async def create_event(
    data: CreateEventSchema,
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    if current_user.role not in [UserRole.ADMIN, UserRole.ALUMNI]:
        raise HTTPException(status_code=403, detail="Only admins and alumni can create events")
    event = Event(
        title=data.title, description=data.description, event_date=data.date,
        location=data.location, venue=data.venue, max_participants=data.max_participants,
        image_url=data.image_url, created_by=current_user.id
    )
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return {"id": str(event.id), "message": "Event created successfully"}


@router.post("/{event_id}/register")
async def register_for_event(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    existing = await db.execute(
        select(EventRegistration).where(
            EventRegistration.event_id == event_id,
            EventRegistration.user_id == current_user.id
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already registered for this event")
    reg = EventRegistration(event_id=event_id, user_id=current_user.id)
    db.add(reg)
    await db.commit()
    return {"message": "Registered for event successfully"}


@router.get("/my-registrations")
async def get_my_registrations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(EventRegistration).where(EventRegistration.user_id == current_user.id)
    )
    return [{"event_id": str(r.event_id), "status": r.status, "registered_at": r.created_at.isoformat()} for r in result.scalars().all()]


@router.get("/{event_id}/registrations")
async def get_event_registrations(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role not in [UserRole.ADMIN, UserRole.ALUMNI]:
        raise HTTPException(status_code=403, detail="Admin or alumni access required")
    result = await db.execute(
        select(EventRegistration, User, AlumniProfile)
        .join(User, EventRegistration.user_id == User.id)
        .join(AlumniProfile, AlumniProfile.user_id == User.id, isouter=True)
        .where(EventRegistration.event_id == event_id)
    )
    rows = result.all()
    return [
        {
            "registration_id": str(r.EventRegistration.id),
            "full_name": r.AlumniProfile.full_name if r.AlumniProfile else r.User.username,
            "email": r.User.email,
            "roll_number": r.AlumniProfile.roll_number if r.AlumniProfile else None,
            "branch": r.AlumniProfile.branch if r.AlumniProfile else None,
            "registered_at": r.EventRegistration.created_at.isoformat()
        }
        for r in rows
    ]


@router.delete("/{event_id}")
async def delete_event(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if current_user.role != UserRole.ADMIN and str(event.created_by) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to delete this event")
    await db.delete(event)
    await db.commit()
    return {"message": "Event deleted successfully"}
