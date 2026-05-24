from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.dependencies import get_db
from app.schemas.contribution_schema import (
    ContributionCreateSchema,
    ContributionResponseSchema
)
from app.services.contribution_service import (
    create_contribution_service,
    list_contributions_service,
    list_my_contributions_service
)
from app.core.security import get_current_user
from app.models.user_model import User
from app.core.roles import UserRole

router = APIRouter(
    prefix="/contributions",
    tags=["Contributions"]
)


@router.post(
    "",
    response_model=ContributionResponseSchema
)
async def create_contribution(
    data: ContributionCreateSchema,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):

    if current_user.role != UserRole.ALUMNI:

        raise HTTPException(
            status_code=403,
            detail="Only alumni can make contributions"
        )

    try:

        return await create_contribution_service(
            data,
            current_user.id,
            db
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.get(
    "",
    response_model=List[ContributionResponseSchema]
)
async def list_contributions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):

    try:

        return await list_contributions_service(db)

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.get(
    "/my",
    response_model=List[ContributionResponseSchema]
)
async def list_my_contributions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):

    try:

        return await list_my_contributions_service(
            current_user.id,
            db
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
