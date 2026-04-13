# routers/translate_router.py

import spacy
from deep_translator import GoogleTranslator

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import User, TranslationSession, SentenceTranslation
from schemas import (
    TranslateRequest,
    TranslateOnlyResponse,
    SentenceTranslationResponse,
    VocabItem,
    SUPPORTED_LANGUAGES,
)

# ── spaCy Setup ───────────────────────────────────────────────────────────────
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    raise RuntimeError(
        "spaCy model not found. Run: python -m spacy download en_core_web_sm"
    )

router = APIRouter(prefix="/api/translate", tags=["Translation"])

LANG_CODE_MAP = {
    "spanish":    "es",
    "french":     "fr",
    "chinese":    "zh-CN",
    "german":     "de",
    "portuguese": "pt",
    "japanese":   "ja",
}


# ── Helpers ───────────────────────────────────────────────────────────────────

def generate_session_title(passage: str) -> str:
    """Generate a session title from the first 5 words of the passage."""
    words = passage.strip().split()[:5]
    title = " ".join(words)

    if len(title) > 50:
        title = title[:47] + "..."

    if len(title.strip()) < 3:
        title = "New Translation Session"

    return title


def split_sentences(text: str) -> list[str]:
    """Split a passage into sentences using spaCy."""
    doc = nlp(text.strip())
    return [sent.text.strip() for sent in doc.sents if sent.text.strip()]


def translate_sentence(sentence: str, target_language: str) -> str:
    """Translate a single sentence using GoogleTranslator."""
    lang_code = LANG_CODE_MAP.get(target_language)

    if not lang_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No language code mapping for: '{target_language}'",
        )

    try:
        translator = GoogleTranslator(source="en", target=lang_code)
        translated  = translator.translate(sentence)

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


def extract_vocab_items(sentence: str) -> list[VocabItem]:
    """
    Extract meaningful vocab items from a sentence using spaCy.

    Skips:
      - punctuation tokens
      - whitespace tokens
      - stopwords  (a, the, is, etc.)
      - single-character tokens

    Returns list of VocabItem(word, lemma, pos).
    """
    doc   = nlp(sentence)
    items = []

    for token in doc:
        if (
            token.is_space
            or token.is_punct
            or token.is_stop
            or len(token.text.strip()) <= 1
        ):
            continue

        items.append(
            VocabItem(
                word  = token.text, lemma = token.lemma_, pos   = token.pos_, )
                )

    return items


def build_sentence_response(
    rec:             SentenceTranslation,
    session_id:      str,
    target_language: str,
) -> SentenceTranslationResponse:
    """
    Convert a SentenceTranslation DB record into a response object.
    Used by both GET endpoints so the shape is always identical.

    Vocab items are re-derived from the stored sentence via spaCy
    so we never need to parse the JSON lemma/pos lists back into
    word-level dicts (they were stored as parallel arrays).
    """
    return SentenceTranslationResponse(
        uid            = rec.uid,
        sentence       = rec.sentence,
        translation    = rec.translation,
        targetLanguage = target_language,
        sessionID      = session_id,
        vocabItems     = extract_vocab_items(rec.sentence),
    )


def get_translation_session(
    session_id: str,
    user_id:    int,
    db:         Session,
) -> TranslationSession:
    """
    Fetch a TranslationSession that belongs to the given user.
    Raises HTTP 404 if not found — same pattern as sessions_router.
    """
    session = (
        db.query(TranslationSession)
        .filter(
            TranslationSession.session_id == session_id,
            TranslationSession.user_id   == user_id,
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Translation session not found",
        )

    return session


# ── Routes ────────────────────────────────────────────────────────────────────

@router.get("/languages")
async def get_languages(
    current_user: User = Depends(get_current_user),
):
    """Return all supported translation languages."""
    return [
        {"code": lang, "name": lang.capitalize()}
        for lang in SUPPORTED_LANGUAGES
    ]


@router.post("", response_model=TranslateOnlyResponse, status_code=201)
async def translate_passage(
    request:      TranslateRequest,
    current_user: User    = Depends(get_current_user),
    db:           Session = Depends(get_db),
):
    """
    Translate a passage sentence-by-sentence.

    Response shape per sentence:
    {
        uid, sentence, translation,
        targetLanguage, sessionID,
        vocabItems: [ { word, lemma, pos } ]
    }
    """
    # ── 1. Split into sentences ───────────────────────────────────────────
    sentences = split_sentences(request.passage)

    if not sentences:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract any sentences from the passage.",
        )

    # ── 2. Create TranslationSession record ───────────────────────────────
    new_session = TranslationSession(
        user_id         = current_user.id,
        title           = generate_session_title(request.passage),
        passage_preview = request.passage[:100].strip(),
        full_passage    = request.passage,
        target_language = request.targetLanguage,
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    # ── 3. Translate each sentence + extract vocab ────────────────────────
    translation_records: list[SentenceTranslation] = []

    for idx, sentence in enumerate(sentences, start=1):
        translated_text = translate_sentence(sentence, request.targetLanguage)
        vocab_items     = extract_vocab_items(sentence)

        # Store as parallel JSON arrays in DB
        record = SentenceTranslation(
            uid         = idx,
            sentence    = sentence,
            translation = translated_text,
            lemma       = [v.lemma for v in vocab_items],
            pos         = [v.pos   for v in vocab_items],
            session_id  = new_session.session_id,
        )
        db.add(record)
        translation_records.append(record)

    db.commit()
    for rec in translation_records:
        db.refresh(rec)

    # ── 4. Build response ─────────────────────────────────────────────────
    return TranslateOnlyResponse(
        translations=[
            SentenceTranslationResponse(
                uid            = rec.uid,
                sentence       = rec.sentence,
                translation    = rec.translation,
                targetLanguage = request.targetLanguage,
                sessionID      = new_session.session_id,
                # Re-extract vocab from spaCy (source of truth)
                vocabItems     = extract_vocab_items(rec.sentence),
            )
            for rec in translation_records
        ]
    )


@router.get("", response_model=TranslateOnlyResponse)
async def get_user_translation_sessions(
    current_user: User    = Depends(get_current_user),
    db:           Session = Depends(get_db),
):
    """Get all translation sessions for the current user."""
    sessions = (
        db.query(TranslationSession)
        .filter(TranslationSession.user_id == current_user.id)
        .order_by(TranslationSession.updated_at.desc())
        .all()
    )

    all_translations: list[SentenceTranslationResponse] = []

    for session in sessions:
        records = (
            db.query(SentenceTranslation)
            .filter(SentenceTranslation.session_id == session.session_id)
            .order_by(SentenceTranslation.uid)
            .all()
        )

        for rec in records:
            all_translations.append(
                build_sentence_response(
                    rec             = rec,
                    session_id      = session.session_id,
                    target_language = session.target_language,
                )
            )

    return TranslateOnlyResponse(translations=all_translations)


@router.get("/{session_id}", response_model=TranslateOnlyResponse)
async def get_translation_session_by_id(
    session_id:   str,
    current_user: User    = Depends(get_current_user),
    db:           Session = Depends(get_db),
):
    """Get a specific translation session with all its sentences."""
    session = get_translation_session(session_id, current_user.id, db)

    records = (
        db.query(SentenceTranslation)
        .filter(SentenceTranslation.session_id == session.session_id)
        .order_by(SentenceTranslation.uid)
        .all()
    )

    return TranslateOnlyResponse(
        translations=[
            build_sentence_response(
                rec             = rec,
                session_id      = session.session_id,
                target_language = session.target_language,
            )
            for rec in records
        ]
    )


@router.delete("/{session_id}")
async def delete_translation_session(
    session_id:   str,
    current_user: User    = Depends(get_current_user),
    db:           Session = Depends(get_db),
):
    """Delete a translation session and all its sentences."""
    session = get_translation_session(session_id, current_user.id, db)

    db.delete(session)
    db.commit()

    return {"message": "Translation session deleted successfully"}


@router.delete("/{session_id}/sentences/{uid}")
async def delete_sentence_translation(
    session_id:   str,
    uid:          int,
    current_user: User    = Depends(get_current_user),
    db:           Session = Depends(get_db),
):
    """Delete a single sentence from a translation session."""
    get_translation_session(session_id, current_user.id, db)

    sentence = (
        db.query(SentenceTranslation)
        .filter(
            SentenceTranslation.session_id == session_id,
            SentenceTranslation.uid        == uid,
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