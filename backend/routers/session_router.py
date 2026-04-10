from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import User, TranslationSession
from schemas import (
    SessionListItem,
    SessionOnlyResponse,  # Changed
    SessionResponse,
)

router = APIRouter(prefix="/api/sessions", tags=["Sessions"])


@router.get("", response_model=list[SessionListItem])
def get_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sessions = (
        db.query(TranslationSession)
        .filter(TranslationSession.user_id == current_user.id)
        .order_by(TranslationSession.created_at.desc())
        .all()
    )

    return [
        SessionListItem(
            sessionID=s.session_id,
            title=s.title,
            passagePreview=s.passage_preview,
            targetLanguage=s.target_language,
            createdAt=s.created_at,
        )
        for s in sessions
    ]


@router.get("/{session_id}", response_model=SessionOnlyResponse)  # Changed
def get_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session_record = (
        db.query(TranslationSession)
        .filter(
            TranslationSession.session_id == session_id,
            TranslationSession.user_id == current_user.id,
        )
        .first()
    )

    if not session_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    # Changed: Return only session details
    return SessionOnlyResponse(
        session=SessionResponse(
            sessionID=session_record.session_id,
            userID=f"user-{current_user.id}",
            title=session_record.title,
            passagePreview=session_record.passage_preview,
            fullPassage=session_record.full_passage,
            targetLanguage=session_record.target_language,
            createdAt=session_record.created_at,
            updatedAt=session_record.updated_at,
        ),
    )


@router.delete("/{session_id}")
def delete_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session_record = (
        db.query(TranslationSession)
        .filter(
            TranslationSession.session_id == session_id,
            TranslationSession.user_id == current_user.id,
        )
        .first()
    )

    if not session_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    db.delete(session_record)
    db.commit()

    return {"message": f"Session '{session_id}' deleted successfully"}