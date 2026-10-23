"""
Minimal auth — no extra dependencies required (uses stdlib only: hmac, hashlib,
base64, json, os, time). Good enough for a student project; swap for a real
JWT library + proper password hashing (e.g. passlib/bcrypt) in production.

Token format: base64url(payload_json) + "." + hmac_sha256_hex(payload_json, secret)
payload = {"sub": <student_id or admin username>, "role": "user"|"admin", "exp": ..., ...extra}

Password storage: PBKDF2-HMAC-SHA256 with a random salt, stored as "salt_hex$hash_hex".
"""

import base64
import hashlib
import hmac
import json
import os
import time
from typing import Optional

from app.config import settings

TOKEN_TTL_SECONDS = 60 * 60 * 8  # 8 hours
PBKDF2_ITERATIONS = 100_000


# ---------- Tokens ----------

def _sign(payload_bytes: bytes) -> str:
    return hmac.new(settings.secret_key.encode(), payload_bytes, hashlib.sha256).hexdigest()


def create_access_token(subject: str, role: str, extra: Optional[dict] = None) -> str:
    payload = {"sub": subject, "role": role, "exp": int(time.time()) + TOKEN_TTL_SECONDS}
    if extra:
        payload.update(extra)

    payload_bytes = json.dumps(payload).encode()
    payload_b64 = base64.urlsafe_b64encode(payload_bytes).decode().rstrip("=")
    signature = _sign(payload_bytes)
    return f"{payload_b64}.{signature}"


def verify_access_token(token: str) -> Optional[dict]:
    """Returns the decoded payload dict if the token is valid and not expired, else None."""
    try:
        payload_b64, signature = token.split(".")
        padding = "=" * (-len(payload_b64) % 4)
        payload_bytes = base64.urlsafe_b64decode(payload_b64 + padding)

        expected_signature = _sign(payload_bytes)
        if not hmac.compare_digest(signature, expected_signature):
            return None

        payload = json.loads(payload_bytes)
        if payload["exp"] < time.time():
            return None

        return payload
    except Exception:
        return None


# ---------- Passwords ----------

def hash_password(password: str) -> str:
    salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, PBKDF2_ITERATIONS)
    return f"{salt.hex()}${dk.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        salt_hex, hash_hex = stored.split("$")
        salt = bytes.fromhex(salt_hex)
        dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, PBKDF2_ITERATIONS)
        return hmac.compare_digest(dk.hex(), hash_hex)
    except Exception:
        return False