from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import (
    SignUpRequest,
    SignInRequest,
    VerifyRequest,
    ResendRequest,
    TokenResponse,
    UserResponse,
    MessageResponse,
)
from auth import (
    supabase_signup,
    supabase_verify_otp,
    supabase_signin,
    supabase_resend,
    create_access_token,
    get_current_user,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ── Step 1: Sign Up (sends verification email) ────────────

@router.post("/signup", response_model=MessageResponse)
def sign_up(body: SignUpRequest, db: Session = Depends(get_db)):
    """
    Register a new user via Supabase Auth.
    Supabase sends a 6-digit verification code to the user's email.
    The user must call POST /auth/verify with the code to complete signup.
    """
    print(f"[SIGNUP] Attempting signup for: {body.email}")

    # Check if username is already taken in our database
    if db.query(User).filter(User.username == body.username).first():
        print(f"[SIGNUP] Username already taken: {body.username}")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken",
        )

    # Check if email already registered in our database
    if db.query(User).filter(User.email == body.email).first():
        print(f"[SIGNUP] Email already registered: {body.email}")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    # Call Supabase Auth — creates user + sends verification email
    supabase_signup(body.email, body.password, body.username)

    print(f"[SIGNUP] ✅ Verification code sent to: {body.email}")

    return MessageResponse(
        message="Verification code sent to your email. Please check your inbox."
    )


# ── Step 2: Verify Email (completes signup) ────────────────

@router.post("/verify", response_model=TokenResponse, status_code=201)
def verify_email(body: VerifyRequest, db: Session = Depends(get_db)):
    """
    Verify the 6-digit code from the confirmation email.
    On success, creates the user in our database and returns a JWT.
    """
    print(f"[VERIFY] Verifying code for: {body.email}")

    # Call Supabase to verify the OTP
    supabase_data = supabase_verify_otp(body.email, body.code)

    # Extract user info from Supabase response
    supabase_user = supabase_data.get("user", {})
    user_metadata = supabase_user.get("user_metadata", {})
    username = user_metadata.get("username", body.email.split("@")[0])
    email = supabase_user.get("email", body.email)

    print(f"[VERIFY] ✅ Supabase verification successful for: {email}")

    # Check if user already exists in our DB (edge case: re-verification)
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        print(f"[VERIFY] User already in DB, issuing token")
        token = create_access_token({
            "user_id": existing_user.id,
            "sub": existing_user.email,
        })
        return TokenResponse(
            access_token=token,
            username=existing_user.username,
        )

    # Handle username conflict (edge case)
    final_username = username
    counter = 1
    while db.query(User).filter(User.username == final_username).first():
        final_username = f"{username}{counter}"
        counter += 1

    # Create user in our database
    user = User(
        username=final_username,
        email=email,
        hashed_password=None,
    )
    db.add(user)

    try:
        db.commit()
        db.refresh(user)
        print(f"[VERIFY] ✅ User created: id={user.id}, username='{user.username}'")
    except Exception as e:
        db.rollback()
        print(f"[VERIFY] ❌ DB commit failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}",
        )

    # Issue our own JWT
    token = create_access_token({
        "user_id": user.id,
        "sub": user.email,
    })

    return TokenResponse(access_token=token, username=user.username)


# ── Resend Verification Code ──────────────────────────────

@router.post("/resend", response_model=MessageResponse)
def resend_code(body: ResendRequest):
    """Resend the verification email with a new OTP code."""
    print(f"[RESEND] Resending code to: {body.email}")

    supabase_resend(body.email)

    print(f"[RESEND] ✅ Code resent to: {body.email}")

    return MessageResponse(
        message="Verification code resent. Please check your inbox."
    )


# ── Sign In ────────────────────────────────────────────────

@router.post("/signin", response_model=TokenResponse)
def sign_in(body: SignInRequest, db: Session = Depends(get_db)):
    """
    Sign in via Supabase Auth (validates email + password).
    Returns our app's JWT if credentials are valid and email is verified.
    """
    print(f"[SIGNIN] Attempting signin for: {body.email}")

    # Authenticate with Supabase (fails if email not confirmed)
    supabase_data = supabase_signin(body.email, body.password)

    supabase_user = supabase_data.get("user", {})
    user_metadata = supabase_user.get("user_metadata", {})
    email = supabase_user.get("email", body.email)

    print(f"[SIGNIN] ✅ Supabase auth successful for: {email}")

    # Look up user in our database
    user = db.query(User).filter(User.email == email).first()

    if not user:
        # User exists in Supabase but not in our DB — create them
        username = user_metadata.get("username", email.split("@")[0])

        # Handle username conflict
        final_username = username
        counter = 1
        while db.query(User).filter(User.username == final_username).first():
            final_username = f"{username}{counter}"
            counter += 1

        user = User(
            username=final_username,
            email=email,
            hashed_password=None,
        )
        db.add(user)
        try:
            db.commit()
            db.refresh(user)
            print(f"[SIGNIN] Created missing DB record: id={user.id}")
        except Exception as e:
            db.rollback()
            print(f"[SIGNIN] ❌ DB commit failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user record",
            )

    print(f"[SIGNIN] ✅ Signin complete: {user.username}")

    token = create_access_token({
        "user_id": user.id,
        "sub": user.email,
    })

    return TokenResponse(access_token=token, username=user.username)


# ── Current User ───────────────────────────────────────────

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user."""
    return current_user
