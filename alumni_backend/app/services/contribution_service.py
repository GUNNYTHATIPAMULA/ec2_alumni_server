from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.contribution_model import Contribution
from app.schemas.contribution_schema import ContributionCreateSchema


async def create_contribution_service(
    data: ContributionCreateSchema,
    alumni_id: str,
    db: AsyncSession
):

    new_contribution = Contribution(
        alumni_id=alumni_id,
        amount=data.amount,
        purpose=data.purpose,
        status="completed"  # Defaulting to completed for simplicity
    )

    db.add(new_contribution)

    await db.commit()

    await db.refresh(new_contribution)

    return new_contribution


async def list_contributions_service(db: AsyncSession):

    result = await db.execute(
        select(Contribution).order_by(
            Contribution.created_at.desc()
        )
    )

    return result.scalars().all()


async def list_my_contributions_service(
    alumni_id: str,
    db: AsyncSession
):

    result = await db.execute(
        select(Contribution)
        .where(Contribution.alumni_id == alumni_id)
        .order_by(Contribution.created_at.desc())
    )

    return result.scalars().all()
