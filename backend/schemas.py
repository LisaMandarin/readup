import re
from datetime import datetime
from pydantic import BaseModel, field_validator
from typing import List, Optional


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


# Session Schemas
class SessionCreateRequest(BaseModel):
    sentence: str

    @field_validator("sentence")
    @classmethod
    def sentence_valid(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 1:
            raise ValueError("Sentence cannot be empty")
        if len(v) > 50000:
            raise ValueError("Sentence too long")
        return v


class SessionUpdateRequest(BaseModel):
    title: Optional[str] = None

    @field_validator("title")
    @classmethod
    def title_valid(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if len(v) < 1:
                raise ValueError("Title cannot be empty")
            if len(v) > 200:
                raise ValueError("Title too long")
        return v


class SessionResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Passage Schemas
class PassageCreateRequest(BaseModel):
    sentence: str
    translation: Optional[str] = None

    @field_validator("sentence")
    @classmethod
    def sentence_valid(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 1:
            raise ValueError("Sentence cannot be empty")
        if len(v) > 50000:
            raise ValueError("Sentence too long")
        return v


class PassageUpdateRequest(BaseModel):
    sentence: Optional[str] = None
    translation: Optional[str] = None

    @field_validator("sentence")
    @classmethod
    def sentence_valid(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if len(v) < 1:
                raise ValueError("Sentence cannot be empty")
            if len(v) > 50000:
                raise ValueError("Sentence too long")
        return v


class PassageResponse(BaseModel):
    id: int
    sentence: str
    translation: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class SessionWithPassagesResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime
    passages: List[PassageResponse]

    class Config:
        from_attributes = True
    token_type: str = "bearer"
    username: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True