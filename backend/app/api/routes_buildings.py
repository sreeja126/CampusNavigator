from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.building import Building
from app.schemas.building import BuildingCreate, BuildingUpdate, BuildingOut

router = APIRouter()


@router.get("/", response_model=List[BuildingOut])
def list_buildings(db: Session = Depends(get_db)):
    return db.query(Building).order_by(Building.name).all()


@router.get("/{building_id}", response_model=BuildingOut)
def get_building(building_id: int, db: Session = Depends(get_db)):
    building = db.query(Building).filter(Building.id == building_id).first()
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")
    return building


@router.post("/", response_model=BuildingOut, status_code=201)
def create_building(payload: BuildingCreate, db: Session = Depends(get_db)):
    building = Building(**payload.model_dump())
    db.add(building)
    db.commit()
    db.refresh(building)
    return building


@router.patch("/{building_id}", response_model=BuildingOut)
def update_building(building_id: int, payload: BuildingUpdate, db: Session = Depends(get_db)):
    building = db.query(Building).filter(Building.id == building_id).first()
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(building, field, value)

    db.commit()
    db.refresh(building)
    return building


@router.delete("/{building_id}", status_code=204)
def delete_building(building_id: int, db: Session = Depends(get_db)):
    building = db.query(Building).filter(Building.id == building_id).first()
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")

    db.delete(building)
    db.commit()
    return None