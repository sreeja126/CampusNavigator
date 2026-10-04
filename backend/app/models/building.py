from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class Building(Base):
    __tablename__ = "buildings"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)          # e.g. "Block B"
    description = Column(String, nullable=True)                 # e.g. "CSE & IT departments"

    # Campus map (Module 6): where this building sits on the campus overview image
    map_x_percent = Column(Integer, nullable=True)              # 0-100
    map_y_percent = Column(Integer, nullable=True)              # 0-100

    # Floor plan (Module 7): the floor plan image for this building
    floor_plan_image_url = Column(String, nullable=True)

    rooms = relationship("Room", back_populates="building", cascade="all, delete-orphan")