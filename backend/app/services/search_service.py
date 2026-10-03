"""
Unified search across faculty and rooms.

A single query string `q` is matched against:
  - faculty name / department
  - room numbers appearing in the timetable

Each faculty result includes their live "current status" (in class / in cabin),
and each room result includes whatever is currently scheduled there, if anything.
"""

from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.faculty import Faculty
from app.models.timetable import TimetableEntry
from app.services.current_status import get_current_status, DAY_NAMES


def search_faculty(q: str, db: Session, limit: int = 10) -> list[dict]:
    rows = (
        db.query(Faculty)
        .filter(
            or_(
                Faculty.name.ilike(f"%{q}%"),
                Faculty.department.ilike(f"%{q}%"),
            )
        )
        .limit(limit)
        .all()
    )

    results = []
    for f in rows:
        status = get_current_status(f, db)
        results.append({
            "type": "faculty",
            "id": f.id,
            "name": f.name,
            "department": f.department,
            "designation": f.designation,
            "cabin_no": f.cabin_no,
            "status": status,
        })
    return results


def search_rooms(q: str, db: Session, limit: int = 10) -> list[dict]:
    now = datetime.now()
    today_name = DAY_NAMES[now.weekday()]
    current_time = now.time()

    # Distinct room numbers matching the query
    room_rows = (
        db.query(TimetableEntry.room_no, TimetableEntry.class_section)
        .filter(TimetableEntry.room_no.ilike(f"%{q}%"))
        .distinct()
        .limit(limit)
        .all()
    )

    results = []
    for room_no, class_section in room_rows:
        if not room_no:
            continue

        # Is anything scheduled in this room right now?
        current_entry = (
            db.query(TimetableEntry)
            .filter(
                TimetableEntry.room_no == room_no,
                TimetableEntry.day_of_week == today_name,
            )
            .all()
        )

        current_subject = None
        current_faculty_name = None
        for entry in current_entry:
            if entry.start_time and entry.end_time and entry.start_time <= current_time <= entry.end_time:
                current_subject = entry.subject
                current_faculty_name = entry.faculty.name if entry.faculty else None
                break

        results.append({
            "type": "room",
            "room_no": room_no,
            "class_section": class_section,
            "current_subject": current_subject,
            "current_faculty_name": current_faculty_name,
        })

    return results


def unified_search(q: str, db: Session) -> dict:
    return {
        "faculty": search_faculty(q, db),
        "rooms": search_rooms(q, db),
    }