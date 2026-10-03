from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional

from app.database import get_db
from app.models.faculty import Faculty
from app.schemas.faculty import FacultyCreate, FacultyUpdate, FacultyOut
from app.schemas.search import FacultyStatusOut
from app.services.current_status import get_current_status

router = APIRouter()


@router.get("/", response_model=List[FacultyOut])
def list_faculty(
    department: Optional[str] = Query(None, description="Filter by department"),
    q: Optional[str] = Query(None, description="Search by name"),
    db: Session = Depends(get_db),
):
    """
    List all faculty, optionally filtered by department or searched by name.
    e.g. GET /api/faculty?department=CSE
         GET /api/faculty?q=sharma
    """
    query = db.query(Faculty)

    if department:
        query = query.filter(Faculty.department == department)

    if q:
        query = query.filter(
            or_(
                Faculty.name.ilike(f"%{q}%"),
                Faculty.department.ilike(f"%{q}%"),
            )
        )

    return query.order_by(Faculty.name).all()


@router.get("/{faculty_id}", response_model=FacultyOut)
def get_faculty(faculty_id: int, db: Session = Depends(get_db)):
    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")
    return faculty


@router.get("/{faculty_id}/status", response_model=FacultyStatusOut)
def get_faculty_status(faculty_id: int, db: Session = Depends(get_db)):
    """
    Returns where this faculty member currently is, based on today's timetable:
    in a class (with room/subject/until-time) or in their cabin by default.
    """
    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")

    return get_current_status(faculty, db)


@router.post("/", response_model=FacultyOut, status_code=201)
def create_faculty(payload: FacultyCreate, db: Session = Depends(get_db)):
    faculty = Faculty(**payload.model_dump())
    db.add(faculty)
    db.commit()
    db.refresh(faculty)
    return faculty


@router.patch("/{faculty_id}", response_model=FacultyOut)
def update_faculty(faculty_id: int, payload: FacultyUpdate, db: Session = Depends(get_db)):
    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(faculty, field, value)

    db.commit()
    db.refresh(faculty)
    return faculty


@router.delete("/{faculty_id}", status_code=204)
def delete_faculty(faculty_id: int, db: Session = Depends(get_db)):
    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")

    db.delete(faculty)
    db.commit()
    return None