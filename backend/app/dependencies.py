from typing import Optional
from fastapi import Header, HTTPException, status, Depends

from app.auth import verify_access_token


def get_current_payload(authorization: Optional[str] = Header(None)) -> dict:
    """
    Verifies the 'Authorization: Bearer <token>' header and returns the decoded
    payload ({"sub": ..., "role": "user"|"admin", ...}). Raises 401 if missing/invalid.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    token = authorization[len("Bearer "):].strip()
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    return payload


def get_current_user(payload: dict = Depends(get_current_payload)) -> dict:
    """Any logged-in identity (student/faculty user OR admin). Returns the full payload."""
    return payload


def get_current_admin(payload: dict = Depends(get_current_payload)) -> str:
    """
    Requires the token's role to be 'admin'. Returns the admin's username on success.
    Use exactly like before: admin: str = Depends(get_current_admin)
    """
    if payload.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return payload["sub"]