from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from auth import get_current_user
from database import get_db
from models import User, Session as SessionModel, Passage
from schemas import (
    SessionCreateRequest,
    SessionResponse,
    PassageCreateRequest,
    PassageResponse,
    SessionWithPassagesResponse
)

router = APIRouter(prefix="/sessions", tags=["sessions"])


def generate_session_title(sentence: str) -> str:
    """Generate a title for session based on the sentence"""
    # Take first 5 words and clean them up
    words = sentence.strip().split()[:5]
    title = " ".join(words)
    
    # Truncate if too long
    if len(title) > 50:
        title = title[:47] + "..."
    
    # If empty or too short, use default
    if len(title.strip()) < 3:
        title = "New Reading Session"
    
    return title


@router.post("/", response_model=SessionResponse)
async def create_session(
    request: SessionCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new session from a sentence"""
    # Generate title from the sentence
    title = generate_session_title(request.sentence)
    
    # Create new session
    new_session = SessionModel(
        user_id=current_user.id,
        title=title
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    
    # Create first passage in the session
    new_passage = Passage(
        session_id=new_session.id,
        sentence=request.sentence
    )
    db.add(new_passage)
    db.commit()
    
    return new_session


@router.get("/", response_model=List[SessionResponse])
async def get_user_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all sessions for the current user"""
    sessions = (
        db.query(SessionModel)
        .filter(SessionModel.user_id == current_user.id)
        .order_by(SessionModel.updated_at.desc())
        .all()
    )
    return sessions


@router.get("/{session_id}", response_model=SessionWithPassagesResponse)
async def get_session_with_passages(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific session with all its passages"""
    session = (
        db.query(SessionModel)
        .options(joinedload(SessionModel.passages))
        .filter(
            SessionModel.id == session_id,
            SessionModel.user_id == current_user.id
        )
        .first()
    )
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    return session


@router.post("/{session_id}/passages", response_model=PassageResponse)
async def add_passage_to_session(
    session_id: int,
    request: PassageCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a new passage to an existing session"""
    # Verify session belongs to current user
    session = (
        db.query(SessionModel)
        .filter(
            SessionModel.id == session_id,
            SessionModel.user_id == current_user.id
        )
        .first()
    )
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Create new passage
    new_passage = Passage(
        session_id=session_id,
        sentence=request.sentence,
        translation=request.translation
    )
    db.add(new_passage)
    
    # Update session's updated_at timestamp
    from datetime import datetime, timezone
    session.updated_at = datetime.now(timezone.utc)
    
    db.commit()
    db.refresh(new_passage)
    
    return new_passage


@router.get("/{session_id}/passages", response_model=List[PassageResponse])
async def get_session_passages(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all passages for a specific session"""
    # Verify session belongs to current user
    session = (
        db.query(SessionModel)
        .filter(
            SessionModel.id == session_id,
            SessionModel.user_id == current_user.id
        )
        .first()
    )
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    passages = (
        db.query(Passage)
        .filter(Passage.session_id == session_id)
        .order_by(Passage.created_at.asc())
        .all()
    )
    
    return passages