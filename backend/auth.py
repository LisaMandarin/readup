import os
import requests as http_requests
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database import get_db
from models import User

load_dotenv()

# ── Configuration ──────────────────────────────────────────

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is not set in .env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
if not SUPABASE_URL:
    raise RuntimeError("SUPABASE_URL is not set in .env")

SUPABASE_KEY = os.getenv("SUPABASE_KEY")
if not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_KEY is not set in .env")

SUPABASE_URL = SUPABASE_URL.rstrip("/")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

security = HTTPBearer()

SUPABASE_HEADERS = {
    "apikey": SUPABASE_KEY,
    "Content-Type": "application/json",
}


# ── Supabase Auth Helpers ──────────────────────────────────

def _parse_supabase_error(data: dict) -> str:
    """Extract a human-readable error message from a Supabase error response."""
    return (
        data.get("msg")
        or data.get("error_description")
        or data.get("message")
        or data.get("error")
        or "Unknown error"
    )


def supabase_signup(email: str, password: str, username: str) -> dict:
    """
    Create a user in Supabase Auth.
    Supabase sends a verification email with a 6-digit OTP code.
    """
    response = http_requests.post(
        f"{SUPABASE_URL}/auth/v1/signup",
        headers=SUPABASE_HEADERS,
        json={
            "email": email,
            "password": password,
            "data": {"username": username},
        },
        timeout=10,
    )

    data = response.json()

    if response.status_code not in (200, 201):
        error_msg = _parse_supabase_error(data)
        print(f"[SUPABASE] Signup error: {error_msg}")
        raise HTTPException(
            status_code=response.status_code,
            detail=error_msg,
        )

    # Check if user was actually created (vs obfuscated response for existing user)
    # Supabase returns identities=[] for fake/obfuscated signups
    identities = data.get("identities", None)
    if identities is not None and len(identities) == 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists in the authentication system",
        )

    return data


def supabase_verify_otp(email: str, token: str) -> dict:
    """Verify the 6-digit OTP code from the confirmation email."""
    response = http_requests.post(
        f"{SUPABASE_URL}/auth/v1/verify",
        headers=SUPABASE_HEADERS,
        json={
            "email": email,
            "token": token,
            "type": "signup",
        },
        timeout=10,
    )

    data = response.json()

    if response.status_code not in (200, 201):
        error_msg = _parse_supabase_error(data)
        print(f"[SUPABASE] Verify error: {error_msg}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg,
        )

    return data


def supabase_signin(email: str, password: str) -> dict:
    """Sign in with email and password via Supabase Auth."""
    response = http_requests.post(
        f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
        headers=SUPABASE_HEADERS,
        json={
            "email": email,
            "password": password,
        },
        timeout=10,
    )

    data = response.json()

    if response.status_code != 200:
        error_msg = _parse_supabase_error(data)
        print(f"[SUPABASE] Signin error: {error_msg}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=error_msg,
        )

    return data


def supabase_resend(email: str) -> dict:
    """Resend the verification email with a new OTP code."""
    response = http_requests.post(
        f"{SUPABASE_URL}/auth/v1/resend",
        headers=SUPABASE_HEADERS,
        json={
            "type": "signup",
            "email": email,
        },
        timeout=10,
    )

    # Some Supabase versions return empty body on success
    if response.status_code in (200, 201):
        return {"message": "Verification code resent"}

    data = response.json() if response.text else {}
    error_msg = _parse_supabase_error(data)
    print(f"[SUPABASE] Resend error: {error_msg}")
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=error_msg,
    )


# ── Our Own JWT Helpers ────────────────────────────────────

def create_access_token(data: dict) -> str:
    """Create a signed JWT for our app (not Supabase's token)."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Decode and validate our app's JWT."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


# ── FastAPI Dependency ─────────────────────────────────────

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """Extract Bearer token, decode it, return the User from our database."""
    payload = decode_access_token(credentials.credentials)
    user_id = payload.get("user_id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user