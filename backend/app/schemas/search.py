from pydantic import BaseModel
from typing import Optional, Literal


class FacultyStatusOut(BaseModel):
    status: Literal["in_class", "in_cabin", "unknown"]
    location: Optional[str] = None
    subject: Optional[str] = None
    class_section: Optional[str] = None
    until: Optional[str] = None


class SearchResultFaculty(BaseModel):
    type: Literal["faculty"] = "faculty"
    id: int
    name: str
    department: str
    designation: Optional[str] = None
    cabin_no: Optional[str] = None
    status: FacultyStatusOut


class SearchResultRoom(BaseModel):
    type: Literal["room"] = "room"
    room_no: str
    class_section: Optional[str] = None
    # what's scheduled there right now, if anything
    current_subject: Optional[str] = None
    current_faculty_name: Optional[str] = None


class SearchResponse(BaseModel):
    faculty: list[SearchResultFaculty] = []
    rooms: list[SearchResultRoom] = []