import re
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator, model_validator


# ── Auth Schemas ───────────────────────────────────────────

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


class VerifyRequest(BaseModel):
    email: str
    code: str

    @field_validator("email")
    @classmethod
    def email_lower(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("code")
    @classmethod
    def code_valid(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Verification code is required")
        if not v.isdigit():
            raise ValueError("Verification code must contain only digits")
        if len(v) not in (6, 8):
            raise ValueError("Verification code must be 6 or 8 digits")
        return v


class ResendRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def email_lower(cls, v: str) -> str:
        return v.strip().lower()


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


class MessageResponse(BaseModel):
    message: str


# ── Translation / Session Schemas ──────────────────────────

SUPPORTED_LANGUAGES = [
    "spanish",
    "french",
    "chinese",
    "german",
    "portuguese",
    "japanese",
]


class TranslateRequest(BaseModel):
    passage: str
    targetLanguage: Optional[str] = None
    target_language: Optional[str] = None

    @model_validator(mode="after")
    def normalize_target_language(self):
        value = self.targetLanguage or self.target_language

        if not value:
            raise ValueError(
                "Target language is required. "
                "Send 'targetLanguage' or 'target_language'."
            )

        value = value.strip().lower()

        if value not in SUPPORTED_LANGUAGES:
            raise ValueError(
                f"Unsupported language: '{value}'. "
                f"Choose from: {', '.join(SUPPORTED_LANGUAGES)}"
            )

        self.targetLanguage = value
        self.target_language = value
        return self

    @field_validator("passage")
    @classmethod
    def passage_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Passage cannot be empty")
        if len(v) > 5000:
            raise ValueError("Passage cannot exceed 5000 characters")
        return v


class SentenceTranslationResponse(BaseModel):
    uid: int
    sentence: str
    translation: str
    lemma: list[str]
    pos: list[str]

    class Config:
        from_attributes = True


class SessionResponse(BaseModel):
    sessionID: str
    userID: str
    title: str
    passagePreview: str
    fullPassage: str
    targetLanguage: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True


class TranslateFullResponse(BaseModel):
    session: SessionResponse
    translations: list[SentenceTranslationResponse]


class SessionListItem(BaseModel):
    sessionID: str
    title: str
    passagePreview: str
    targetLanguage: str
    createdAt: datetime

    class Config:
        from_attributes = True