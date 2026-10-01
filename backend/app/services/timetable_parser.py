"""
Parses an uploaded timetable file (CSV or Excel) into TimetableEntry rows.

Expected columns (case-insensitive, order doesn't matter):
    class_section, day_of_week, period_number, start_time, end_time,
    subject, room_no, faculty_name

faculty_name is matched against the existing Faculty table by name.
If no match is found, the row is still inserted but faculty_id is left null,
and a warning is added to the summary so the admin can fix it later.
"""

import pandas as pd
from io import BytesIO
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.timetable import TimetableEntry
from app.models.faculty import Faculty

REQUIRED_COLUMNS = {
    "class_section", "day_of_week", "period_number", "subject",
}


def _read_file(filename: str, content: bytes) -> pd.DataFrame:
    buffer = BytesIO(content)
    if filename.lower().endswith(".csv"):
        return pd.read_csv(buffer)
    elif filename.lower().endswith((".xlsx", ".xls")):
        return pd.read_excel(buffer)
    else:
        raise ValueError("Unsupported file type. Please upload a .csv or .xlsx file.")


def _parse_time(value):
    if pd.isna(value) or value == "":
        return None
    if isinstance(value, str):
        for fmt in ("%H:%M", "%H:%M:%S", "%I:%M %p"):
            try:
                return datetime.strptime(value.strip(), fmt).time()
            except ValueError:
                continue
        return None
    # pandas may already parse it into a datetime.time or Timestamp
    if hasattr(value, "time"):
        return value.time()
    return value


def parse_and_store_timetable(filename: str, content: bytes, db: Session) -> dict:
    df = _read_file(filename, content)
    df.columns = [c.strip().lower() for c in df.columns]

    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise ValueError(f"Missing required columns: {', '.join(sorted(missing))}")

    # Pre-load faculty for name -> id lookup (case-insensitive)
    faculty_by_name = {
        f.name.strip().lower(): f.id for f in db.query(Faculty).all()
    }

    rows_processed = 0
    rows_inserted = 0
    rows_skipped = 0
    errors = []

    for idx, row in df.iterrows():
        rows_processed += 1
        try:
            faculty_id = None
            faculty_name = str(row.get("faculty_name", "")).strip()
            if faculty_name and faculty_name.lower() != "nan":
                faculty_id = faculty_by_name.get(faculty_name.lower())
                if faculty_id is None:
                    errors.append(
                        f"Row {idx + 2}: faculty '{faculty_name}' not found — saved without faculty link."
                    )

            entry = TimetableEntry(
                class_section=str(row["class_section"]).strip(),
                day_of_week=str(row["day_of_week"]).strip().capitalize(),
                period_number=int(row["period_number"]),
                start_time=_parse_time(row.get("start_time")),
                end_time=_parse_time(row.get("end_time")),
                subject=str(row["subject"]).strip(),
                room_no=str(row.get("room_no", "")).strip() or None,
                faculty_id=faculty_id,
            )
            db.add(entry)
            rows_inserted += 1
        except Exception as e:
            rows_skipped += 1
            errors.append(f"Row {idx + 2}: {str(e)}")

    db.commit()

    return {
        "rows_processed": rows_processed,
        "rows_inserted": rows_inserted,
        "rows_skipped": rows_skipped,
        "errors": errors,
    }