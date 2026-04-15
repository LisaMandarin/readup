# schemas.py — complete rewrite

import re
from datetime import datetime
from typing import Optional, List
from enum import Enum
from pydantic import BaseModel, field_validator, model_validator


# ── Auth Schemas ───────────────────────────────────────────────────────────────

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


# ── Translation Schemas ────────────────────────────────────────────────────────

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

    @model_validator(mode="after")
    def normalize_target_language(self):
        value = self.targetLanguage

        if not value:
            raise ValueError(
                "Target language is required. Send 'targetLanguage'."
            )

        value = value.strip().lower()

        if value not in SUPPORTED_LANGUAGES:
            raise ValueError(
                f"Unsupported language: '{value}'. "
                f"Choose from: {', '.join(SUPPORTED_LANGUAGES)}"
            )

        self.targetLanguage = value
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


class VocabItem(BaseModel):
    """Single vocab word with its spaCy lemma and POS tag."""
    word:  str
    lemma: str
    pos:   str

    class Config:
        from_attributes = True


class SentenceTranslationResponse(BaseModel):
    """
    One translated sentence matching the exact response shape:
    {
        uid: 12,
        sentence: "...",
        translation: "...",
        targetLanguage: "portuguese",
        sessionID: "session-d91e",
        vocabItems: [ { word, lemma, pos }, ... ]
    }
    """
    uid:            int
    sentence:       str
    translation:    str
    targetLanguage: str
    sessionID:      str
    vocabItems:     List[VocabItem]

    class Config:
        from_attributes = True


class TranslateOnlyResponse(BaseModel):
    """Top-level response wrapping all translated sentences."""
    translations: List[SentenceTranslationResponse]

    class Config:
        from_attributes = True


class TranslationSessionSummary(BaseModel):
    """Lightweight session metadata for the session-history list."""
    sessionID:      str
    title:          str
    passagePreview: str
    fullPassage:    str
    targetLanguage: str
    createdAt:      datetime
    updatedAt:      datetime

    class Config:
        from_attributes = True


# ── Lookup Schemas ─────────────────────────────────────────────────────────────

class LookupType(str, Enum):
    english_definition  = "english_definition"
    spanish_translation = "spanish_translation"
    example_sentence    = "example_sentence"
    cefr_level          = "cefr_level"


class WordLookupRequest(BaseModel):
    word:            str
    context:         Optional[str] = None
    lookup_type:     LookupType
    target_language: str = "spanish"


class WordLookupResponse(BaseModel):
    word:        str
    lookup_type: LookupType
    result:      str


# ── Comprehension Schemas ──────────────────────────────────────────────────────

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
    score:  int
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


# ── Session Schemas ────────────────────────────────────────────────────────────

class SessionCreateRequest(BaseModel):
    sentence: str

    @field_validator("sentence")
    @classmethod
    def sentence_non_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Sentence cannot be empty")
        return v


class SessionUpdateRequest(BaseModel):
    title: Optional[str] = None

    @field_validator("title")
    @classmethod
    def title_valid(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if len(v) < 1 or len(v) > 100:
                raise ValueError("Title must be 1-100 characters")
        return v


class SessionResponse(BaseModel):
    id:         int
    title:      str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ── Passage Schemas ────────────────────────────────────────────────────────────

class PassageCreateRequest(BaseModel):
    sentence:    str
    translation: Optional[str] = None

    @field_validator("sentence")
    @classmethod
    def sentence_non_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Sentence cannot be empty")
        return v

    @field_validator("translation")
    @classmethod
    def translation_optional(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if not v:
                return None
        return v


class PassageUpdateRequest(BaseModel):
    sentence:    Optional[str] = None
    translation: Optional[str] = None

    @field_validator("sentence")
    @classmethod
    def sentence_optional(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if not v:
                raise ValueError("Sentence cannot be empty")
        return v

    @field_validator("translation")
    @classmethod
    def translation_optional(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if not v:
                return None
        return v


class PassageResponse(BaseModel):
    id:          int
    sentence:    str
    translation: Optional[str] = None

    class Config:
        from_attributes = True


class SessionWithPassagesResponse(BaseModel):
    id:         int
    title:      str
    created_at: datetime
    updated_at: datetime
    passages:   List[PassageResponse]

    class Config:
        from_attributes = True