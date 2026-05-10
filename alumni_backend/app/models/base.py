from sqlalchemy import Column, Integer
from app.core.database import Base


class TestTable(Base):
    __tablename__ = "test_table"

    id = Column(Integer, primary_key=True, index=True)