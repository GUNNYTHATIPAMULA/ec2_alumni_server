from pydantic import (
    BaseModel,
    EmailStr,
    Field
)


class AdminRegisterSchema(BaseModel):

    full_name: str

    username: str

    email: EmailStr

    phone_number: str

    password: str = Field(
        min_length=8,
        max_length=32
    )

    designation: str | None = None

    department: str | None = None