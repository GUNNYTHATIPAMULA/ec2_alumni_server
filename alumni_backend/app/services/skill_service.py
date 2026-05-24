from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.alumni_skill_model import AlumniSkill
from app.models.alumni_model import AlumniProfile


async def add_skill_service(user_id: str, data, db: AsyncSession):
    result = await db.execute(
        select(AlumniProfile).where(AlumniProfile.user_id == user_id)
    )
    alumni = result.scalar_one_or_none()
    if not alumni:
        raise Exception("Alumni profile not found")

    skill = AlumniSkill(alumni_id=alumni.id, skill_name=data.skill_name)
    db.add(skill)
    await db.commit()
    await db.refresh(skill)
    return {"message": "Skill added successfully", "skill": skill}


async def list_skills_service(user_id: str, db: AsyncSession):
    result = await db.execute(
        select(AlumniProfile).where(AlumniProfile.user_id == user_id)
    )
    alumni = result.scalar_one_or_none()
    if not alumni:
        raise Exception("Alumni profile not found")

    skills_res = await db.execute(
        select(AlumniSkill).where(AlumniSkill.alumni_id == alumni.id)
    )
    return skills_res.scalars().all()


async def delete_skill_service(skill_id: str, user_id: str, db: AsyncSession):
    result = await db.execute(
        select(AlumniProfile).where(AlumniProfile.user_id == user_id)
    )
    alumni = result.scalar_one_or_none()
    if not alumni:
        raise Exception("Alumni profile not found")

    skill_res = await db.execute(
        select(AlumniSkill).where(
            AlumniSkill.id == skill_id,
            AlumniSkill.alumni_id == alumni.id,
        )
    )
    skill = skill_res.scalar_one_or_none()
    if not skill:
        raise Exception("Skill not found")

    await db.delete(skill)
    await db.commit()
    return {"message": "Skill deleted successfully"}
