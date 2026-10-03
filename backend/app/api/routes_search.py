from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.search import SearchResponse
from app.services.search_service import unified_search

router = APIRouter()


@router.get("/", response_model=SearchResponse)
def search(
    q: str = Query(..., min_length=1, description="Search text — faculty name, department, or room number"),
    db: Session = Depends(get_db),
):
    """
    Unified search across faculty and rooms.
    e.g. GET /api/search?q=sharma   -> matches faculty named/departmented "sharma"
         GET /api/search?q=B-101   -> matches room B-101 and shows what's on now
    """
    return unified_search(q, db)