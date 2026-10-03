"""
Determines where a faculty member should currently be, based on:
  - the current day of week and time, and
  - their timetable entries.

If a timetable entry's day matches today and the current time falls within
start_time–end_time, the faculty member is "in class" at that room.
Otherwise, they default to "in cabin".

Note: this is schedule-derived, not live tracking — it assumes faculty
follow the timetable as published. There is no check-in/check-out signal.
"""

from datetime import datetime, time as dtime
from sqlalchemy.orm import Session

from app.models.timetable import TimetableEntry
from app.models.faculty import Faculty

DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def get_current_status(faculty: Faculty, db: Session, now: datetime | None = None) -> dict:
    """
    Returns a dict describing where this faculty member currently is:
    {
        "status": "in_class" | "in_cabin" | "unknown",
        "location": str,          # room_no or cabin_no
        "subject": str | None,    # only set when in_class
        "class_section": str | None,
        "until": str | None,      # "HH:MM" end time, only when in_class
    }
    """
    now = now or datetime.now()
    today_name = DAY_NAMES[now.weekday()]
    current_time = now.time()

    entries_today = (
        db.query(TimetableEntry)
        .filter(
            TimetableEntry.faculty_id == faculty.id,
            TimetableEntry.day_of_week == today_name,
        )
        .all()
    )

    for entry in entries_today:
        if entry.start_time and entry.end_time:
            if entry.start_time <= current_time <= entry.end_time:
                return {
                    "status": "in_class",
                    "location": entry.room_no,
                    "subject": entry.subject,
                    "class_section": entry.class_section,
                    "until": entry.end_time.strftime("%H:%M"),
                }

    # No matching class right now — default to cabin, if known
    if faculty.cabin_no:
        return {
            "status": "in_cabin",
            "location": faculty.cabin_no,
            "subject": None,
            "class_section": None,
            "until": None,
        }

    return {
        "status": "unknown",
        "location": None,
        "subject": None,
        "class_section": None,
        "until": None,
    }