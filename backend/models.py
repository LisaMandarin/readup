import uuid
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base


def generate_session_id():
    return f"session-{uuid.uuid4().hex[:4]}"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)  # Not used — Supabase handles passwords
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    sessions = relationship("TranslationSession", back_populates="user")

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"


class TranslationSession(Base):
    __tablename__ = "translation_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(
        String(20), unique=True, index=True, nullable=False,
        default=generate_session_id,
    )
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    passage = Column(Text, nullable=False)
    target_language = Column(String(30), nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user = relationship("User", back_populates="sessions")
    translations = relationship(
        "SentenceTranslation",
        back_populates="session",
        order_by="SentenceTranslation.uid",
    )


class SentenceTranslation(Base):
    __tablename__ = "sentence_translations"

    id = Column(Integer, primary_key=True, index=True)
    uid = Column(Integer, nullable=False)
    sentence = Column(Text, nullable=False)
    translation = Column(Text, nullable=False)
    target_language = Column(String(30), nullable=False)
    session_id = Column(
        String(20),
        ForeignKey("translation_sessions.session_id"),
        nullable=False,
    )

    session = relationship("TranslationSession", back_populates="translations")