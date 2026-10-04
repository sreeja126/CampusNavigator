"""
Quick seed script — inserts sample buildings and rooms for local testing.
Room numbers here match those used in sample_timetable.csv (B-101, B-102)
so that Module 7's floor-plan hotspots will show live class data.

Run with:
    python -m app.seed_buildings
"""

from app.database import SessionLocal, engine, Base
from app.models.building import Building
from app.models.room import Room

Base.metadata.create_all(bind=engine)

SAMPLE_BUILDINGS = [
    {
        "name": "Block A",
        "description": "Administration & ECE department",
        "map_x_percent": 20,
        "map_y_percent": 30,
    },
    {
        "name": "Block B",
        "description": "CSE & IT departments",
        "map_x_percent": 50,
        "map_y_percent": 40,
    },
    {
        "name": "Block C",
        "description": "IT department & labs",
        "map_x_percent": 75,
        "map_y_percent": 35,
    },
]

# Keyed by building name so rooms can be attached after buildings are created
SAMPLE_ROOMS = {
    "Block A": [
        {"floor": 3, "room_no": "A-305", "room_type": "cabin"},
    ],
    "Block B": [
        {"floor": 1, "room_no": "B-101", "room_type": "classroom"},
        {"floor": 1, "room_no": "B-102", "room_type": "classroom"},
        {"floor": 2, "room_no": "B-204", "room_type": "cabin"},
        {"floor": 2, "room_no": "B-206", "room_type": "cabin"},
    ],
    "Block C": [
        {"floor": 1, "room_no": "C-101", "room_type": "cabin"},
        {"floor": 1, "room_no": "C-102", "room_type": "lab"},
    ],
}


def seed():
    db = SessionLocal()
    try:
        if db.query(Building).count() > 0:
            print("Buildings table already has data — skipping seed.")
            return

        name_to_building = {}
        for entry in SAMPLE_BUILDINGS:
            building = Building(**entry)
            db.add(building)
            db.flush()  # get building.id without committing yet
            name_to_building[entry["name"]] = building

        room_count = 0
        for building_name, rooms in SAMPLE_ROOMS.items():
            building = name_to_building[building_name]
            for room_data in rooms:
                db.add(Room(building_id=building.id, **room_data))
                room_count += 1

        db.commit()
        print(f"Seeded {len(SAMPLE_BUILDINGS)} buildings and {room_count} rooms.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()