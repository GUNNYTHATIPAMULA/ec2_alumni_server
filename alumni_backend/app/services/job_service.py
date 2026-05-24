from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.job_model import Job


async def create_job_service(data, user_id: str, db: AsyncSession):
    job = Job(
        title=data.title,
        company=data.company,
        location=data.location,
        description=data.description,
        requirements=data.requirements,
        employment_type=data.employment_type or "full-time",
        experience_level=data.experience_level,
        salary_range=data.salary_range,
        application_deadline=data.application_deadline,
        contact_email=data.contact_email,
        posted_by_id=user_id,
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job


async def list_jobs_service(db: AsyncSession):
    result = await db.execute(
        select(Job).where(Job.is_active == True).order_by(desc(Job.created_at))
    )
    return result.scalars().all()


async def list_my_jobs_service(user_id: str, db: AsyncSession):
    result = await db.execute(
        select(Job).where(Job.posted_by_id == user_id).order_by(desc(Job.created_at))
    )
    return result.scalars().all()


async def delete_job_service(job_id: str, user_id: str, db: AsyncSession):
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    if not job:
        raise Exception("Job not found")
    if str(job.posted_by_id) != user_id:
        raise Exception("You can only delete your own job postings")
    await db.delete(job)
    await db.commit()
    return {"message": "Job deleted successfully"}
