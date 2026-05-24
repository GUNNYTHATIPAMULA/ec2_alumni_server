from pydantic import BaseModel
from uuid import UUID


class AddSkillSchema(BaseModel):
    skill_name: str


class SkillResponseSchema(BaseModel):
    id: UUID
    skill_name: str
