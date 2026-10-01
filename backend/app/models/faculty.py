from sqlalchemy import Column, Integer, String
from app.database import Base


class Faculty(Base):
    __tablename__ = "faculty"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    department = Column(String, nullable=False, index=True)
    designation = Column(String, nullable=True)       # e.g. "Assistant Professor"
    cabin_no = Column(String, nullable=True)           # e.g. "B-204"
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)           # served from /storage later
