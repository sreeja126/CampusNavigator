from pydantic import BaseModel, ConfigDict
from typing import Optional


class BuildingBase(BaseModel):
    name: str
    description: Optional[str] = None
    map_x_percent: Optional[int] = None
    map_y_percent: Optional[int] = None
    floor_plan_image_url: Optional[str] = None


class BuildingCreate(BuildingBase):
    pass


class BuildingUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    map_x_percent: Optional[int] = None
    map_y_percent: Optional[int] = None
    floor_plan_image_url: Optional[str] = None


class BuildingOut(BuildingBase):
    id: int

    model_config = ConfigDict(from_attributes=True)