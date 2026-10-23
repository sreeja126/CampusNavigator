from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.config import settings
from app.auth import create_access_token, hash_password, verify_password
from app.models.user import AppUser

router = APIRouter()


class RegisterRequest(BaseModel):
    name: str
    student_id: str
    password: str


class UserLoginRequest(BaseModel):
    student_id: str
    password: str


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    name: str


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """Sign-up for regular users (students/faculty) — name, a unique ID, and a password."""
    existing = db.query(AppUser).filter(AppUser.student_id == payload.student_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this ID already exists.")

    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    user = AppUser(
        name=payload.name,
        student_id=payload.student_id,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.student_id, role="user", extra={"name": user.name})
    return TokenResponse(access_token=token, role="user", name=user.name)


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLoginRequest, db: Session = Depends(get_db)):
    """Login for regular users, by ID + password."""
    user = db.query(AppUser).filter(AppUser.student_id == payload.student_id).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect ID or password")

    token = create_access_token(subject=user.student_id, role="user", extra={"name": user.name})
    return TokenResponse(access_token=token, role="user", name=user.name)


@router.post("/admin-login", response_model=TokenResponse)
def admin_login(payload: AdminLoginRequest):
    """Login for the single admin account — credentials come from .env, not the database."""
    if payload.username != settings.admin_username or payload.password != settings.admin_password:
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    token = create_access_token(subject=payload.username, role="admin", extra={"name": payload.username})
    return TokenResponse(access_token=token, role="admin", name=payload.username)