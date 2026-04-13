from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Dict, Any
from auth import get_current_user
from database import get_db
from models import User, ReadingSession as SessionModel, Passage
from schemas import (
    SessionCreateRequest,
    SessionUpdateRequest,
    SessionResponse,
    PassageCreateRequest,
    PassageUpdateRequest,
    PassageResponse,
    SessionWithPassagesResponse
)
from translation_service import TranslationService, TranslationSaveError

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


@router.put("/{session_id}", response_model=SessionResponse)
async def update_session(
    session_id: int,
    request: SessionUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a session's title or other metadata"""
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
    
    # Update fields if provided
    if request.title is not None:
        session.title = request.title
    
    db.commit()
    db.refresh(session)
    
    return session


@router.delete("/{session_id}")
async def delete_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a session and all its passages"""
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
    
    db.delete(session)
    db.commit()
    
    return {"message": "Session deleted successfully"}


# ── Passage endpoints for sessions ────────────────────

@router.post("/{session_id}/passages", response_model=PassageResponse)
async def create_passage_in_session(
    session_id: int,
    request: PassageCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a new passage to an existing session"""
    # Verify session exists and belongs to user
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
    
    # Create new passage using TranslationService
    try:
        new_passage = TranslationService.save_translation(
            db=db,
            session_id=session_id,
            sentence=request.sentence,
            translation=request.translation,
            user_id=current_user.id
        )
        return new_passage
    except TranslationSaveError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.put("/{session_id}/passages/{passage_id}", response_model=PassageResponse)
async def update_passage(
    session_id: int,
    passage_id: int,
    request: PassageUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a passage in a session"""
    # Verify session exists and belongs to user
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
    
    # Find the passage
    passage = (
        db.query(Passage)
        .filter(
            Passage.id == passage_id,
            Passage.session_id == session_id
        )
        .first()
    )
    
    if not passage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Passage not found"
        )
    
    # Update passage using TranslationService
    try:
        updated_passage = TranslationService.update_translation(
            db=db,
            passage_id=passage_id,
            session_id=session_id,
            sentence=request.sentence,
            translation=request.translation,
            user_id=current_user.id
        )
        return updated_passage
    except TranslationSaveError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{session_id}/passages/{passage_id}")
async def delete_passage(
    session_id: int,
    passage_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a passage from a session"""
    # Verify session exists and belongs to user
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
    
    # Find the passage
    passage = (
        db.query(Passage)
        .filter(
            Passage.id == passage_id,
            Passage.session_id == session_id
        )
        .first()
    )
    
    if not passage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Passage not found"
        )
    
    db.delete(passage)
    db.commit()
    
    return {"message": "Passage deleted successfully"}


# ── Enhanced Translation Endpoints (Tigbo Integration) ────────────────────

@router.post("/{session_id}/batch-passages", response_model=List[PassageResponse])
async def batch_create_passages(
    session_id: int,
    passages_data: List[Dict[str, str]],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Batch create multiple passages with translations
    Supports Tigbo workflow for bulk translation saving
    """
    try:
        saved_passages = TranslationService.batch_save_translations(
            db=db,
            session_id=session_id,
            passages_data=passages_data,
            user_id=current_user.id
        )
        return saved_passages
    except TranslationSaveError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/{session_id}/translation-stats", response_model=Dict[str, Any])
async def get_translation_statistics(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get translation statistics for a session - useful for Tigbo monitoring"""
    # Verify session belongs to user
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
    
    return TranslationService.get_translation_statistics(db, session_id)


# ══════════════════════════════════════════════════════════════
# MISSING CRUD ENDPOINTS - Added to complete Session API
# ══════════════════════════════════════════════════════════════

@router.get("/{session_id}/passages", response_model=List[PassageResponse])
async def get_session_passages(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """READ - Get all passages in a session (missing CRUD operation)"""
    # Verify session exists and belongs to user
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
    
    # Get all passages for this session
    passages = (
        db.query(Passage)
        .filter(Passage.session_id == session_id)
        .order_by(Passage.id)
        .all()
    )
    
    return passages


@router.get("/{session_id}/passages/{passage_id}", response_model=PassageResponse)
async def get_specific_passage(
    session_id: int,
    passage_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """READ - Get a specific passage (missing CRUD operation)"""
    # Verify session belongs to user first
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
    
    # Find the passage
    passage = (
        db.query(Passage)
        .filter(
            Passage.id == passage_id,
            Passage.session_id == session_id
        )
        .first()
    )
    
    if not passage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Passage not found"
        )
    
    return passage


@router.patch("/{session_id}/validate-translations")
async def validate_session_translations(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    VALIDATION - Validate all translations in a session for data integrity
    Quality assurance endpoint for complete CRUD functionality
    """
    # Verify session exists and belongs to user
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
    
    # Get all passages for validation
    passages = db.query(Passage).filter(Passage.session_id == session_id).all()
    
    validation_results = []
    issues_found = 0
    
    for passage in passages:
        validation = TranslationService.validate_translation_data(
            passage.sentence, 
            passage.translation
        )
        
        if not validation["is_valid"]:
            issues_found += 1
            validation_results.append({
                "passage_id": passage.id,
                "sentence_preview": passage.sentence[:50] + "..." if len(passage.sentence) > 50 else passage.sentence,
                "issues": validation["errors"]
            })
    
    return {
        "session_id": session_id,
        "total_passages": len(passages),
        "issues_found": issues_found,
        "validation_passed": issues_found == 0,
        "problematic_passages": validation_results,
        "crud_api_complete": True
    }
