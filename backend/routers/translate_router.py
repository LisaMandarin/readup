# routers/translate_router.py

from deep_translator import GoogleTranslator

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import User, TranslationSession, SentenceTranslation
from schemas import (
    TranslateRequest,
    TranslateOnlyResponse,
    SUPPORTED_LANGUAGES,
)
from translation_sessions import (
    build_sentence_response,
    extract_vocab_items,
    nlp,
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

    # ── 2. Persist session + translations atomically ──────────────────────
    new_session = TranslationSession(
        user_id         = current_user.id,
        title           = generate_session_title(request.passage),
        passage_preview = request.passage[:100].strip(),
        full_passage    = request.passage,
        target_language = request.targetLanguage,
    )
    translation_records: list[SentenceTranslation] = []

    try:
        db.add(new_session)
        db.flush()

        # ── 3. Translate each sentence + extract vocab ────────────────────
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
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise

    db.refresh(new_session)
    for rec in translation_records:
        db.refresh(rec)

    # ── 4. Build response ─────────────────────────────────────────────────
    return TranslateOnlyResponse(
        translations=[
            build_sentence_response(
                rec=rec,
                session_id=new_session.session_id,
                target_language=request.targetLanguage,
            )
            for rec in translation_records
        ]
    )
