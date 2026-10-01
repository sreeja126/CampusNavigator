from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.timetable import TimetableEntry
from app.models.faculty import Faculty
from app.schemas.timetable import TimetableEntryOut, UploadSummary
from app.services.timetable_parser import parse_and_store_timetable

router = APIRouter()

DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


@router.post("/upload", response_model=UploadSummary)
async def upload_timetable(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Upload a CSV or Excel file to bulk-insert timetable entries.
    Expected columns: class_section, day_of_week, period_number, start_time,
    end_time, subject, room_no, faculty_name
    """
    content = await file.read()
    try:
        summary = parse_and_store_timetable(file.filename, content, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return summary


@router.get("/", response_model=List[TimetableEntryOut])
def get_timetable(
    class_section: Optional[str] = Query(None, description="e.g. CSE-3A"),
    faculty_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    """
    Fetch timetable entries, filtered by class_section or faculty_id.
    At least one filter is recommended — returns everything if neither is given.
    """
    query = db.query(TimetableEntry)

    if class_section:
        query = query.filter(TimetableEntry.class_section == class_section)
    if faculty_id:
        query = query.filter(TimetableEntry.faculty_id == faculty_id)

    entries = query.all()

    # Sort by day-of-week order, then period number
    entries.sort(
        key=lambda e: (
            DAY_ORDER.index(e.day_of_week) if e.day_of_week in DAY_ORDER else 99,
            e.period_number,
        )
    )

    # Attach faculty_name for display convenience
    results = []
    for e in entries:
        out = TimetableEntryOut.model_validate(e)
        if e.faculty_id:
            faculty = db.query(Faculty).filter(Faculty.id == e.faculty_id).first()
            out.faculty_name = faculty.name if faculty else None
        results.append(out)

    return results


@router.get("/class-sections",  response_model=List[str])
def list_class_sections(db: Session = Depends(get_db)):
    """Returns the distinct list of class sections currently in the timetable."""
    rows = db.query(TimetableEntry.class_section).distinct().all()
    return sorted([r[0] for r in rows])