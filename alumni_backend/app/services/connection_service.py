from sqlalchemy import select, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.connection_model import Connection
from app.models.user_model import User


async def send_connection_request_service(
    sender_id: str,
    receiver_id: str,
    db: AsyncSession
):

    if sender_id == receiver_id:

        raise Exception(
            "Cannot connect to yourself"
        )

    # Check if receiver exists

    rec_result = await db.execute(
        select(User).where(User.id == receiver_id)
    )

    receiver = rec_result.scalar_one_or_none()

    if not receiver:

        raise Exception("Receiver user not found")

    # Check for existing connection request

    conn_result = await db.execute(
        select(Connection).where(
            or_(
                and_(
                    Connection.sender_id == sender_id,
                    Connection.receiver_id == receiver_id
                ),
                and_(
                    Connection.sender_id == receiver_id,
                    Connection.receiver_id == sender_id
                )
            )
        )
    )

    existing = conn_result.scalar_one_or_none()

    if existing:

        if existing.status == "accepted":

            raise Exception(
                "You are already connected"
            )

        else:

            raise Exception(
                f"Connection request already exists in state: {existing.status}"
            )

    new_connection = Connection(
        sender_id=sender_id,
        receiver_id=receiver_id,
        status="pending"
    )

    db.add(new_connection)

    await db.commit()

    await db.refresh(new_connection)

    return new_connection


async def update_connection_request_service(
    request_id: str,
    current_user_id: str,
    status: str,
    db: AsyncSession
):

    if status not in ["accepted", "rejected"]:

        raise Exception(
            "Invalid status value. Use 'accepted' or 'rejected'."
        )

    result = await db.execute(
        select(Connection).where(
            Connection.id == request_id
        )
    )

    connection = result.scalar_one_or_none()

    if not connection:

        raise Exception(
            "Connection request not found"
        )

    # Verify current user is the receiver

    if str(connection.receiver_id) != str(
        current_user_id
    ):

        raise Exception(
            "You are not authorized to respond to this request"
        )

    connection.status = status

    await db.commit()

    await db.refresh(connection)

    return connection


async def list_pending_requests_service(
    user_id: str,
    db: AsyncSession
):

    result = await db.execute(
        select(Connection)
        .where(
            (Connection.receiver_id == user_id) &
            (Connection.status == "pending")
        )
    )

    return result.scalars().all()


async def list_connections_service(
    user_id: str,
    db: AsyncSession
):

    result = await db.execute(
        select(Connection)
        .where(
            (
                (Connection.sender_id == user_id) |
                (Connection.receiver_id == user_id)
            ) & (Connection.status == "accepted")
        )
    )

    return result.scalars().all()
