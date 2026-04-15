# routers/lookup_router.py

from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from gemini_service import ai_fill_vocab_fields
from models import LookupResult, User
from schemas import WordLookupRequest, WordLookupResponse
from translation_sessions import get_owned_translation_session

router = APIRouter(prefix="/api/lookup", tags=["Lookup"])


@router.post("", response_model=WordLookupResponse)
def ai_vocab_lookup(
    body: WordLookupRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = get_owned_translation_session(body.session_id, current_user.id, db)
    result = ai_fill_vocab_fields(
        lemma=body.lemma,
        pos=body.pos,
        targetLanguage=body.target_language,
        options=body.options,
    )
    lookup_result = LookupResult(
        id=f"{body.session_id}:{body.uid}:{body.lemma.lower()}",
        uid=body.uid,
        selected_text=body.selected_text,
        part_of_speech=body.pos,
        lemma=body.lemma,
        requested_options=body.options.model_dump(),
        translation=result["translation"],
        definition=result["definition"],
        example=result["example"],
        level=result["level"],
        session_id=session.session_id,
    )

    existing_lookup_result = (
        db.query(LookupResult)
        .filter(
            LookupResult.session_id == body.session_id,
            LookupResult.uid == body.uid,
            LookupResult.lemma == body.lemma,
        )
        .first()
    )

    if existing_lookup_result:
        existing_lookup_result.id = lookup_result.id
        existing_lookup_result.selected_text = lookup_result.selected_text
        existing_lookup_result.part_of_speech = lookup_result.part_of_speech
        existing_lookup_result.lemma = lookup_result.lemma
        existing_lookup_result.requested_options = lookup_result.requested_options
        existing_lookup_result.translation = lookup_result.translation
        existing_lookup_result.definition = lookup_result.definition
        existing_lookup_result.example = lookup_result.example
        existing_lookup_result.level = lookup_result.level
        existing_lookup_result.error = None
    else:
        db.add(lookup_result)

    session.updated_at = datetime.now(timezone.utc)
    db.commit()

    return WordLookupResponse(
        id=lookup_result.id,
        word=body.word,
        lemma=body.lemma,
        pos=body.pos,
        target_language=body.target_language,
        translation=result["translation"],
        definition=result["definition"],
        example=result["example"],
        level=result["level"],
    )
