from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user_model import User
from app.models.admin_model import AdminProfile

from app.core.roles import UserRole

from app.utils.otp_utils import generate_otp
from app.utils.password_utils import hash_password
from app.utils.email_utils import send_email_otp


async def register_admin_service(
    data,
    db: AsyncSession
):

    existing_user = await db.execute(
        select(User).where(
            User.email == data.email
        )
    )

    user = existing_user.scalar_one_or_none()

    if user:
        raise Exception("Email already exists")

    otp = generate_otp()

    new_user = User(
        username=data.username,
        email=data.email,
        phone_number=data.phone_number,
        hashed_password=hash_password(
            data.password
        ),
        role=UserRole.ADMIN,
        email_otp=otp,
        otp_expiry=datetime.utcnow() + timedelta(minutes=5)
    )

    db.add(new_user)

    await db.flush()

    admin_profile = AdminProfile(
        user_id=new_user.id,
        full_name=data.full_name,
        designation=data.designation,
        department=data.department,
        office_email=data.email
    )

    db.add(admin_profile)

    await db.commit()

    await send_email_otp(
        data.email,
        otp
    )

    return {
        "message": "Admin registered successfully. OTP sent to email."
    }