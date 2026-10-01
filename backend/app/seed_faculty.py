"""
Quick seed script — inserts sample faculty rows for local testing.

Run with:
    docker-compose exec backend python -m app.seed_faculty
or, without Docker:
    python -m app.seed_faculty
"""

from app.database import Base, SessionLocal, engine
from app.models.faculty import Faculty

# Make sure tables exist before seeding
Base.metadata.create_all(bind=engine)

SAMPLE_FACULTY = [
    {
        "name": "Dr. R. Sharma",
        "department": "CSE",
        "designation": "Professor",
        "cabin_no": "B-204",
        "email": "r.sharma@college.edu",
        "phone": "9876543210",
    },
    {
        "name": "Dr. K. Reddy",
        "department": "CSE",
        "designation": "Associate Professor",
        "cabin_no": "B-206",
        "email": "k.reddy@college.edu",
        "phone": "9876543211",
    },
    {
        "name": "J. Saritha",
        "department": "IT",
        "designation": "Assistant Professor",
        "cabin_no": "C-101",
        "email": "j.saritha@college.edu",
        "phone": "9876543212",
    },
    {
        "name": "Dr. M. Rao",
        "department": "ECE",
        "designation": "Professor",
        "cabin_no": "A-305",
        "email": "m.rao@college.edu",
        "phone": "9876543213",
    },
]


def seed():
    db = SessionLocal()
    try:
        existing = db.query(Faculty).count()
        if existing > 0:
            print(f"Faculty table already has {existing} rows — skipping seed.")
            return

        for entry in SAMPLE_FACULTY:
            db.add(Faculty(**entry))

        db.commit()
        print(f"Seeded {len(SAMPLE_FACULTY)} faculty records.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
