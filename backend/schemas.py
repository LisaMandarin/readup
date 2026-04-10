import re
from pydantic import BaseModel, field_validator


class SignUpRequest(BaseModel):
    username: str
    email: str
    password: str

    @field_validator("username")
    @classmethod
    def username_valid(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 3 or len(v) > 50:
            raise ValueError("Username must be 3–50 characters")
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise ValueError(
                "Username may only contain letters, numbers, and underscores"
            )
        return v

    @field_validator("email")
    @classmethod
    def email_valid(cls, v: str) -> str:
        v = v.strip().lower()
        pattern = r"^[\w\.\+\-]+@[\w\.\-]+\.[a-zA-Z]{2,}$"
        if not re.match(pattern, v):
            raise ValueError("Invalid email address")
        return v

    @field_validator("password")
    @classmethod
    def password_strong(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class SignInRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def email_lower(cls, v: str) -> str:
        return v.strip().lower()


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True


class ComprehensionRequest(BaseModel):
    passage: str
    summary: str

    @field_validator("passage", "summary")
    @classmethod
    def non_empty_text(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("This field cannot be empty")
        return v


class ComprehensionResponse(BaseModel):
    score: int
    advice: str

    @field_validator("score")
    @classmethod
    def score_in_range(cls, v: int) -> int:
        if v < 1 or v > 5:
            raise ValueError("Score must be between 1 and 5")
        return v

    @field_validator("advice")
    @classmethod
    def advice_non_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Advice cannot be empty")
        return v
