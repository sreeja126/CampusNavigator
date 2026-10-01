from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.api import routes_faculty, routes_timetable

# Create tables on startup. This is fine for early development;
# once the schema stabilizes, switch to Alembic migrations instead.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Campus Navigator API",
    description="Backend for the college wayfinding & timetable platform",
    version="0.1.0",
)

# Allow the React dev server (and later, the deployed frontend) to call this API.
# Tighten this list before going to production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Campus Navigator API is running"}


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "environment": settings.environment,
    }


app.include_router(routes_faculty.router, prefix="/api/faculty", tags=["Faculty"])

app.include_router(routes_timetable.router, prefix="/api/timetable", tags=["Timetable"])
# Future modules will plug in like this:
# from app.api import routes_timetable, routes_rooms
# app.include_router(routes_rooms.router, prefix="/api/rooms", tags=["Rooms"])
