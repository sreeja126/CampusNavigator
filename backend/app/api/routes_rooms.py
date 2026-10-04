from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.room import Room
from app.schemas.room import RoomCreate, RoomUpdate, RoomOut

router = APIRouter()


@router.get("/", response_model=List[RoomOut])
def list_rooms(
    building_id: Optional[int] = Query(None),
    floor: Optional[int] = Query(None),
    room_type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """
    List rooms, optionally filtered by building, floor, or type.
    e.g. GET /api/rooms?building_id=1&floor=2
         GET /api/rooms?room_type=lab
    """
    query = db.query(Room)

    if building_id is not None:
        query = query.filter(Room.building_id == building_id)
    if floor is not None:
        query = query.filter(Room.floor == floor)
    if room_type:
        query = query.filter(Room.room_type == room_type)

    return query.order_by(Room.room_no).all()


@router.get("/{room_id}", response_model=RoomOut)
def get_room(room_id: int, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room


@router.post("/", response_model=RoomOut, status_code=201)
def create_room(payload: RoomCreate, db: Session = Depends(get_db)):
    room = Room(**payload.model_dump())
    db.add(room)
    db.commit()
    db.refresh(room)
    return room


@router.patch("/{room_id}", response_model=RoomOut)
def update_room(room_id: int, payload: RoomUpdate, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(room, field, value)

    db.commit()
    db.refresh(room)
    return room


@router.delete("/{room_id}", status_code=204)
def delete_room(room_id: int, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    db.delete(room)
    db.commit()
    return None