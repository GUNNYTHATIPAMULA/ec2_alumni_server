from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.alumni_education_model import AlumniEducation
from app.models.alumni_model import AlumniProfile


async def add_education_service(user_id: str, data, db: AsyncSession):
    result = await db.execute(
        select(AlumniProfile).where(AlumniProfile.user_id == user_id)
    )
    alumni = result.scalar_one_or_none()
    if not alumni:
        raise Exception("Alumni profile not found")

    edu = AlumniEducation(
        alumni_id=alumni.id,
        degree=data.degree,
        institution=data.institution,
        field_of_study=data.field_of_study,
        start_year=data.start_year,
        end_year=data.end_year,
    )
    db.add(edu)
    await db.commit()
    await db.refresh(edu)
    return {"message": "Education added successfully", "education": edu}


async def list_education_service(user_id: str, db: AsyncSession):
    result = await db.execute(
        select(AlumniProfile).where(AlumniProfile.user_id == user_id)
    )
    alumni = result.scalar_one_or_none()
    if not alumni:
        raise Exception("Alumni profile not found")

    edu_res = await db.execute(
        select(AlumniEducation).where(AlumniEducation.alumni_id == alumni.id)
    )
    return edu_res.scalars().all()


async def delete_education_service(edu_id: str, user_id: str, db: AsyncSession):
    result = await db.execute(
        select(AlumniProfile).where(AlumniProfile.user_id == user_id)
    )
    alumni = result.scalar_one_or_none()
    if not alumni:
        raise Exception("Alumni profile not found")

    edu_res = await db.execute(
        select(AlumniEducation).where(
            AlumniEducation.id == edu_id,
            AlumniEducation.alumni_id == alumni.id,
        )
    )
    edu = edu_res.scalar_one_or_none()
    if not edu:
        raise Exception("Education entry not found")

    await db.delete(edu)
    await db.commit()
    return {"message": "Education deleted successfully"}
