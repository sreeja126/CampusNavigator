from pydantic import BaseModel, ConfigDict
from typing import Optional


class RoomBase(BaseModel):
    building_id: int
    floor: int = 1
    room_no: str
    room_type: str = "classroom"   # classroom | lab | cabin | other
    photo_url: Optional[str] = None
    x_percent: Optional[float] = None
    y_percent: Optional[float] = None


class RoomCreate(RoomBase):
    pass


class RoomUpdate(BaseModel):
    building_id: Optional[int] = None
    floor: Optional[int] = None
    room_no: Optional[str] = None
    room_type: Optional[str] = None
    photo_url: Optional[str] = None
    x_percent: Optional[float] = None
    y_percent: Optional[float] = None


class RoomOut(RoomBase):
    id: int

    model_config = ConfigDict(from_attributes=True)