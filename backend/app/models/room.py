from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)

    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=False)
    building = relationship("Building", back_populates="rooms")

    floor = Column(Integer, nullable=False, default=1)          # 1, 2, 3 ...
    room_no = Column(String, nullable=False, index=True)        # e.g. "B-204" — matches timetable.room_no
    room_type = Column(String, nullable=False, default="classroom")  # classroom | lab | cabin | other

    photo_url = Column(String, nullable=True)                   # actual photo of the room/lab

    # Floor plan hotspot position (Module 7) — percentage coords on the floor plan image
    x_percent = Column(Float, nullable=True)
    y_percent = Column(Float, nullable=True)