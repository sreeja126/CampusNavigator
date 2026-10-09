"""
Adds placeholder x/y hotspot coordinates and sample photo URLs to the rooms
seeded in seed_buildings.py, so Module 7's floor-plan hotspots have something
to click on immediately — even without a real floor plan image yet.

These coordinates work with the fallback grid view regardless. If you later
upload a real floor_plan_image_url for a building, update these x_percent/
y_percent values to match where the room actually sits on that image.

Run with:
    python -m app.seed_room_photos
"""

from app.database import SessionLocal
from app.models.room import Room
from app.models.building import Building  
# room_no -> (x_percent, y_percent, photo_url)
ROOM_UPDATES = {
    "B-101": (20, 30, "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600"),
    "B-102": (55, 30, "https://images.unsplash.com/photo-1562774053-701939374585?w=600"),
    "B-204": (20, 65, "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600"),
    "B-206": (55, 65, None),
    "A-305": (50, 50, None),
    "C-101": (30, 40, None),
    "C-102": (70, 40, "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600"),
}


def seed():
    db = SessionLocal()
    try:
        updated = 0
        for room_no, (x, y, photo_url) in ROOM_UPDATES.items():
            room = db.query(Room).filter(Room.room_no == room_no).first()
            if not room:
                print(f"Skipping {room_no} — not found. Run seed_buildings.py first.")
                continue
            room.x_percent = x
            room.y_percent = y
            if photo_url:
                room.photo_url = photo_url
            updated += 1

        db.commit()
        print(f"Updated hotspot coordinates/photos for {updated} rooms.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()