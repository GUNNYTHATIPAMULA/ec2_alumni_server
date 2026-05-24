from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.event_image_model import EventImage
from app.models.event_model import Event


async def add_event_image_service(event_id: str, data, user_id: str, db: AsyncSession):
    event_res = await db.execute(select(Event).where(Event.id == event_id))
    event = event_res.scalar_one_or_none()
    if not event:
        raise Exception("Event not found")

    img = EventImage(
        event_id=event_id,
        image_url=data.image_url,
        caption=data.caption,
    )
    db.add(img)
    await db.commit()
    await db.refresh(img)
    return img


async def list_event_images_service(event_id: str, db: AsyncSession):
    result = await db.execute(
        select(EventImage).where(EventImage.event_id == event_id)
    )
    return result.scalars().all()


async def delete_event_image_service(image_id: str, db: AsyncSession):
    result = await db.execute(select(EventImage).where(EventImage.id == image_id))
    img = result.scalar_one_or_none()
    if not img:
        raise Exception("Event image not found")
    await db.delete(img)
    await db.commit()
    return {"message": "Event image deleted successfully"}
