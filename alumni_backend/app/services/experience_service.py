from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.alumni_experience_model import AlumniExperience
from app.models.alumni_model import AlumniProfile


async def get_alumni_profile_id(user_id: str, db: AsyncSession) -> str:
    result = await db.execute(
        select(AlumniProfile).where(AlumniProfile.user_id == user_id)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise Exception("Alumni profile not found")
    return str(profile.id)


async def add_experience_service(
    user_id: str,
    data,
    db: AsyncSession
):
    alumni_id = await get_alumni_profile_id(user_id, db)
    experience = AlumniExperience(
        alumni_id=alumni_id,
        company_name=data.company_name,
        role=data.role,
        start_year=data.start_year,
        end_year=data.end_year,
        description=data.description,
    )
    db.add(experience)
    await db.commit()
    await db.refresh(experience)
    return {
        "experience": {
            "id": str(experience.id),
            "alumni_id": str(experience.alumni_id),
            "company_name": experience.company_name,
            "role": experience.role,
            "start_year": experience.start_year,
            "end_year": experience.end_year,
            "description": experience.description,
        }
    }


async def list_experience_service(
    user_id: str,
    db: AsyncSession
):
    alumni_id = await get_alumni_profile_id(user_id, db)
    result = await db.execute(
        select(AlumniExperience)
        .where(AlumniExperience.alumni_id == alumni_id)
        .order_by(AlumniExperience.start_year.desc())
    )
    experiences = result.scalars().all()
    return [
        {
            "id": str(exp.id),
            "alumni_id": str(exp.alumni_id),
            "company_name": exp.company_name,
            "role": exp.role,
            "start_year": exp.start_year,
            "end_year": exp.end_year,
            "description": exp.description,
        }
        for exp in experiences
    ]


async def delete_experience_service(
    exp_id: str,
    user_id: str,
    db: AsyncSession
):
    alumni_id = await get_alumni_profile_id(user_id, db)
    result = await db.execute(
        select(AlumniExperience).where(
            AlumniExperience.id == exp_id,
            AlumniExperience.alumni_id == alumni_id
        )
    )
    experience = result.scalar_one_or_none()
    if not experience:
        raise Exception("Experience not found")
    await db.delete(experience)
    await db.commit()
    return {"message": "Experience deleted successfully"}
