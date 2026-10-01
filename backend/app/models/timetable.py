from sqlalchemy import Column, Integer, String, Time, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class TimetableEntry(Base):
    __tablename__ = "timetable_entries"

    id =Column(Integer, primary_key=True, index=True)

    class_section = Column(String, nullable=False, index=True)   # e.g. "CSE-3A"
    day_of_week = Column(String, nullable=False, index=True)     # "Monday", "Tuesday", ...
    period_number = Column(Integer, nullable=False)              # 1, 2, 3 ...

    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)

    subject = Column(String, nullable=False)
    room_no = Column(String, nullable=True)

    faculty_id = Column(Integer, ForeignKey("faculty.id"), nullable=True)
    faculty = relationship("Faculty")