import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship

from database import Base


def generate_session_id() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id              = Column(Integer, primary_key=True, index=True)
    username        = Column(String(50), unique=True, index=True, nullable=False)
    email           = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)
    created_at      = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    reading_sessions     = relationship("ReadingSession",     back_populates="user")
    translation_sessions = relationship("TranslationSession", back_populates="user")



class ReadingSession(Base):
    __tablename__ = "sessions"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    title      = Column(String(100), nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

   
    user     = relationship("User",    back_populates="reading_sessions")
    passages = relationship("Passage", back_populates="session")

    def __repr__(self):
        return f"<ReadingSession(id={self.id}, title='{self.title}', user_id={self.user_id})>"


class Passage(Base):
    __tablename__ = "passages"

    id         = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False)
    sentence   = Column(Text, nullable=False)
    translation = Column(Text, nullable=True)

    session = relationship("ReadingSession", back_populates="passages")

    def __repr__(self):
        return f"<Passage(id={self.id}, session_id={self.session_id})>"


class TranslationSession(Base):
    __tablename__ = "translation_sessions"

    id          = Column(Integer, primary_key=True, index=True)
    session_id  = Column(
        String(64),
        unique=True,
        index=True,
        nullable=False,
        default=generate_session_id,
    )
    user_id          = Column(Integer, ForeignKey("users.id"), nullable=False)
    title            = Column(String(255), nullable=False)
    passage_preview  = Column(String(255), nullable=False)
    full_passage     = Column(Text, nullable=False)
    target_language  = Column(String(50), nullable=False)
    created_at       = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at       = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # ✅ FIX 3: back_populates matches User.translation_sessions (not "sessions")
    user         = relationship("User", back_populates="translation_sessions")
    translations = relationship(
        "SentenceTranslation",
        back_populates="session",
        order_by="SentenceTranslation.uid",
        cascade="all, delete-orphan",
    )


class SentenceTranslation(Base):
    __tablename__ = "sentence_translations"

    id          = Column(Integer, primary_key=True, index=True)
    uid         = Column(Integer, nullable=False)
    sentence    = Column(Text, nullable=False)
    translation = Column(Text, nullable=False)
    lemma       = Column(JSON, nullable=False)
    pos         = Column(JSON, nullable=False)
    session_id  = Column(
        String(64),
        ForeignKey("translation_sessions.session_id"),
        nullable=False,
    )

    session = relationship("TranslationSession", back_populates="translations")