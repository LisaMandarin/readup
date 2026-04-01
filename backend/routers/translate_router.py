import spacy
from deep_translator import GoogleTranslator

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import User, TranslationSession, SentenceTranslation
from schemas import (
    TranslateRequest,
    TranslateFullResponse,
    SessionResponse,
    SentenceTranslationResponse,
    SessionListItem,
    SUPPORTED_LANGUAGES,
)
from auth import get_current_user

# ── Load spaCy English model ──────────────────────────────

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    raise RuntimeError(
        "spaCy model not found. Run: python -m spacy download en_core_web_sm"
    )

router = APIRouter(prefix="/translate", tags=["Translation"])

# ── Language name → deep-translator code mapping ──────────

LANG_CODE_MAP = {
    "spanish": "es",
    "french": "fr",
    "chinese": "zh-CN",
    "german": "de",
    "portuguese": "pt",
    "japanese": "ja",
}


# ── Helper: split passage into sentences ───────────────────

def split_sentences(text: str) -> list[str]:
    """Use spaCy to segment text into individual sentences."""
    doc = nlp(text.strip())
    sentences = [sent.text.strip() for sent in doc.sents if sent.text.strip()]
    return sentences


# ── Helper: translate a single sentence ────────────────────

def translate_sentence(sentence: str, target_language: str) -> str:
    """Use deep-translator (Google Translate) to translate one sentence."""
    lang_code = LANG_CODE_MAP.get(target_language)

    if not lang_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No language code mapping for: '{target_language}'",
        )

    try:
        translator = GoogleTranslator(source="en", target=lang_code)
        translated = translator.translate(sentence)

        if not translated:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Translation returned empty result",
            )

        return translated

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Translation failed: {str(e)}",
        )


# ── Helper: generate a short title from the passage ───────

def generate_title(passage: str) -> str:
    """Create a short title from the first sentence of the passage."""
    doc = nlp(passage.strip())
    first_sentence = next(doc.sents, None)

    if first_sentence:
        words = first_sentence.text.strip().split()
        if len(words) <= 7:
            return first_sentence.text.strip().rstrip(".")
        return " ".join(words[:7]) + "..."

    # Fallback
    words = passage.split()[:6]
    return " ".join(words) + "..."


# ── Endpoints ─────────────────────────────────────────────

@router.get("/languages")
def get_languages(current_user: User = Depends(get_current_user)):
    """Return the 4 supported target languages."""
    return [
        {"code": lang, "name": lang.capitalize()}
        for lang in SUPPORTED_LANGUAGES
    ]


@router.post("/", response_model=TranslateFullResponse, status_code=201)
def translate_passage(
    body: TranslateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Translate a passage sentence by sentence.
    1. Split passage into sentences using spaCy
    2. Translate each sentence using deep-translator (Google Translate)
    3. Store session + translations in the database
    4. Return the full response
    """

    print(f"[TRANSLATE] User: {current_user.username}")
    print(f"[TRANSLATE] Target: {body.targetLanguage}")
    print(f"[TRANSLATE] Passage length: {len(body.passage)} chars")

    # Step 1: Split into sentences
    sentences = split_sentences(body.passage)

    if not sentences:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract any sentences from the passage.",
        )

    print(f"[TRANSLATE] Found {len(sentences)} sentences")

    # Step 2: Generate a title
    title = generate_title(body.passage)
    print(f"[TRANSLATE] Title: {title}")

    # Step 3: Create the session in the database
    session_record = TranslationSession(
        user_id=current_user.id,
        title=title,
        passage=body.passage,
        target_language=body.targetLanguage,
    )
    db.add(session_record)

    try:
        db.commit()
        db.refresh(session_record)
        print(f"[TRANSLATE] Session created: {session_record.session_id}")
    except Exception as e:
        db.rollback()
        print(f"[TRANSLATE] ❌ Session creation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create session: {str(e)}",
        )

    # Step 4: Translate each sentence and store
    translation_records = []

    for idx, sentence in enumerate(sentences, start=1):
        print(f"[TRANSLATE] Translating sentence {idx}/{len(sentences)}: "
              f"{sentence[:50]}...")

        translated_text = translate_sentence(sentence, body.targetLanguage)

        print(f"[TRANSLATE] → {translated_text[:50]}...")

        record = SentenceTranslation(
            uid=idx,
            sentence=sentence,
            translation=translated_text,
            target_language=body.targetLanguage,
            session_id=session_record.session_id,
        )
        db.add(record)
        translation_records.append(record)

    try:
        db.commit()
        for rec in translation_records:
            db.refresh(rec)
        print(f"[TRANSLATE] ✅ All {len(translation_records)} translations saved")
    except Exception as e:
        db.rollback()
        print(f"[TRANSLATE] ❌ Translation save failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save translations: {str(e)}",
        )

    # Step 5: Build and return the response
    return TranslateFullResponse(
        session=SessionResponse(
            sessionID=session_record.session_id,
            userID=f"user-{current_user.id}",
            title=session_record.title,
            passage=session_record.passage,
            targetLanguage=session_record.target_language,
            createdAt=session_record.created_at,
            updatedAt=session_record.updated_at,
        ),
        translations=[
            SentenceTranslationResponse(
                uid=rec.uid,
                sentence=rec.sentence,
                translation=rec.translation,
                targetLanguage=rec.target_language,
                sessionID=rec.session_id,
            )
            for rec in translation_records
        ],
    )


@router.get("/sessions", response_model=list[SessionListItem])
def get_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return all translation sessions for the current user."""
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
            targetLanguage=s.target_language,
            createdAt=s.created_at,
        )
        for s in sessions
    ]


@router.get("/sessions/{session_id}", response_model=TranslateFullResponse)
def get_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return a specific translation session with all its translations."""
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

    return TranslateFullResponse(
        session=SessionResponse(
            sessionID=session_record.session_id,
            userID=f"user-{current_user.id}",
            title=session_record.title,
            passage=session_record.passage,
            targetLanguage=session_record.target_language,
            createdAt=session_record.created_at,
            updatedAt=session_record.updated_at,
        ),
        translations=[
            SentenceTranslationResponse(
                uid=t.uid,
                sentence=t.sentence,
                translation=t.translation,
                targetLanguage=t.target_language,
                sessionID=t.session_id,
            )
            for t in session_record.translations
        ],
    )


@router.delete("/sessions/{session_id}")
def delete_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a translation session and all its translations."""
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

    db.query(SentenceTranslation).filter(
        SentenceTranslation.session_id == session_id
    ).delete()
    db.delete(session_record)
    db.commit()

    return {"message": f"Session '{session_id}' deleted successfully"}