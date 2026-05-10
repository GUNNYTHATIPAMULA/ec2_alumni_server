from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db
from app.schemas.auth_schema import (
    AdminRegisterSchema
)

from app.services.auth_service import (
    register_admin_service
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register-admin")
async def register_admin(
    data: AdminRegisterSchema,
    db: AsyncSession = Depends(get_db)
):

    try:

        return await register_admin_service(
            data,
            db
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )