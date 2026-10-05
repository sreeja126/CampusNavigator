# Campus Navigator

A college website that helps students locate faculty cabins, view class timetables,
and find which faculty member is in which classroom — with an interactive campus
map and floor plans showing real photos of labs and rooms.

## Status

🚧 Under active development. Built module by module — see commit history.

**Module 1 (current):** Project skeleton — FastAPI backend, React frontend, Docker Compose, Postgres.

## Tech Stack

- **Backend:** FastAPI, SQLAlchemy, PostgreSQL, Alembic
- **Frontend:** React (Vite), Axios, React Router
- **Infra:** Docker, Docker Compose

## Getting Started

### Prerequisites
- Docker & Docker Compose installed
- (Optional, for non-Docker dev) Python 3.10+, Node.js 18+

### Setup

1. Clone the repo and copy the environment file:
   ```bash
   cp .env.example .env
   ```

2. Start everything with Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Visit:
   - Frontend: http://localhost:5173
   - Backend health check: http://localhost:8000/health
   - API docs (Swagger): http://localhost:8000/docs

### Running without Docker (manual dev setup)

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
campus-navigator/
├── backend/     # FastAPI app
├── frontend/    # React app
├── storage/     # Uploaded photos, floor plans, timetables
└── docker-compose.yml
```

## Modules / Roadmap

- [x] Module 1 — Project skeleton
- [x] Module 2 — Faculty directory
- [x] Module 3 — Timetable upload & viewer
- [x] Module 4 — Search + live "who's here now" status
- [x] Module 5 — Buildings & rooms data
- [x] Module 6 — Campus map (building-level)
- [ ] Module 7 — Floor plans with clickable room hotspots + photos
- [ ] Module 8 — Admin dashboard
- [ ] Module 9 — Polish & deployment
