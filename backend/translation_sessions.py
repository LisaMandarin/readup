import spacy

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models import SentenceTranslation, TranslationSession
from schemas import SentenceTranslationResponse, VocabItem


try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    raise RuntimeError(
        "spaCy model not found. Run: python -m spacy download en_core_web_sm"
    )


def extract_vocab_items(sentence: str) -> list[VocabItem]:
    """Derive vocab metadata from a source sentence using the shared spaCy model."""
    doc = nlp(sentence)
    items: list[VocabItem] = []

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
                word=token.text,
                lemma=token.lemma_,
                pos=token.pos_,
            )
        )

    return items


def build_sentence_response(
    rec: SentenceTranslation,
    session_id: str,
    target_language: str,
) -> SentenceTranslationResponse:
    return SentenceTranslationResponse(
        uid=rec.uid,
        sentence=rec.sentence,
        translation=rec.translation,
        targetLanguage=target_language,
        sessionID=session_id,
        vocabItems=extract_vocab_items(rec.sentence),
    )


def get_owned_translation_session(
    session_id: str,
    user_id: int,
    db: Session,
) -> TranslationSession:
    session = (
        db.query(TranslationSession)
        .filter(
            TranslationSession.session_id == session_id,
            TranslationSession.user_id == user_id,
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    return session
