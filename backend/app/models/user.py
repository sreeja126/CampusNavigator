from sqlalchemy import Column, Integer, String
from app.database import Base


class AppUser(Base):
    """Regular (student/faculty) account — separate from the single admin login."""
    __tablename__ = "app_users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    student_id = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)