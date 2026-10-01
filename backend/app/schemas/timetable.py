from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import time


class TimetableEntryBase(BaseModel):
    class_section: str
    day_of_week: str
    period_number: int
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    subject: str
    room_no: Optional[str] = None
    faculty_id: Optional[int] = None


class TimetableEntryCreate(TimetableEntryBase):
    pass


class TimetableEntryOut(TimetableEntryBase):
    id: int
    faculty_name: Optional[str] = None  # filled in manually in the route, not a DB column

    model_config  = ConfigDict(from_attributes=True)


class UploadSummary(BaseModel):
    rows_processed: int
    rows_inserted: int
    rows_skipped: int
    errors: list[str] = []