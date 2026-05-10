from fastapi import FastAPI

from app.api.router import router

from app.core.database import (
    engine,
    Base
)

from app.models.user_model import User
from app.models.admin_model import AdminProfile
from app.models.alumni_model import AlumniProfile
from app.models.student_model import StudentProfile


app = FastAPI()


@app.on_event("startup")
async def startup():

    async with engine.begin() as conn:

        await conn.run_sync(
            Base.metadata.create_all
        )


app.include_router(router)


@app.get("/")
async def home():

    return {
        "message": "Alumni Backend Running"
    }