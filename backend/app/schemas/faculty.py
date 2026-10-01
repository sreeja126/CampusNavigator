from pydantic import BaseModel, ConfigDict
from typing import Optional


class FacultyBase(BaseModel):
    name: str
    department: str
    designation: Optional[str] = None
    cabin_no: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    photo_url: Optional[str] = None


class FacultyCreate(FacultyBase):
    """Used when creating a new faculty record."""
    pass


class FacultyUpdate(BaseModel):
    """All fields optional — used for partial updates (PATCH)."""
    name: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    cabin_no: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    photo_url: Optional[str] = None


class FacultyOut(FacultyBase):
    """Used when returning faculty data to the client."""
    id: int

    model_config = ConfigDict(from_attributes=True)
