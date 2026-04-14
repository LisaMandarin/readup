from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import User, TranslationSession, SentenceTranslation
from schemas import (
    SessionUpdateRequest,
    TranslationSessionSummaryResponse,
    TranslationSessionDetailResponse,
)
from translation_sessions import (
    build_sentence_response,
    get_owned_translation_session,
)

router = APIRouter(prefix="/api/sessions", tags=["Sessions"])


def build_session_summary(
    session: TranslationSession,
) -> TranslationSessionSummaryResponse:
    return TranslationSessionSummaryResponse(
        sessionID=session.session_id,
        title=session.title,
        passagePreview=session.passage_preview,
        targetLanguage=session.target_language,
        createdAt=session.created_at,
        updatedAt=session.updated_at,
    )


@router.get("", response_model=List[TranslationSessionSummaryResponse])
async def get_user_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return translation session summaries for the current user."""
    sessions = (
        db.query(TranslationSession)
        .filter(TranslationSession.user_id == current_user.id)
        .order_by(TranslationSession.updated_at.desc())
        .all()
    )

    return [build_session_summary(session) for session in sessions]


@router.get("/{session_id}", response_model=TranslationSessionDetailResponse)
async def get_session_detail(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return one translation session and all translated sentences."""
    session = get_owned_translation_session(session_id, current_user.id, db)
    records = (
        db.query(SentenceTranslation)
        .filter(SentenceTranslation.session_id == session.session_id)
        .order_by(SentenceTranslation.uid)
        .all()
    )

    return TranslationSessionDetailResponse(
        sessionID=session.session_id,
        title=session.title,
        passagePreview=session.passage_preview,
        fullPassage=session.full_passage,
        targetLanguage=session.target_language,
        createdAt=session.created_at,
        updatedAt=session.updated_at,
        translations=[
            build_sentence_response(
                rec=record,
                session_id=session.session_id,
                target_language=session.target_language,
            )
            for record in records
        ],
    )


@router.put("/{session_id}", response_model=TranslationSessionSummaryResponse)
async def update_session(
    session_id: str,
    request: SessionUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update mutable translation session metadata."""
    session = get_owned_translation_session(session_id, current_user.id, db)

    if request.title is not None:
        session.title = request.title

    db.commit()
    db.refresh(session)

    return build_session_summary(session)


@router.delete("/{session_id}")
async def delete_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a translation session and its sentence rows."""
    session = get_owned_translation_session(session_id, current_user.id, db)
    db.delete(session)
    db.commit()
    return {"message": "Session deleted successfully"}


@router.delete("/{session_id}/sentences/{uid}")
async def delete_session_sentence(
    session_id: str,
    uid: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete one translated sentence from a translation session."""
    get_owned_translation_session(session_id, current_user.id, db)
    sentence = (
        db.query(SentenceTranslation)
        .filter(
            SentenceTranslation.session_id == session_id,
            SentenceTranslation.uid == uid,
        )
        .first()
    )

    if not sentence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sentence not found",
        )

    db.delete(sentence)
    db.commit()
    return {"message": "Sentence deleted successfully"}
