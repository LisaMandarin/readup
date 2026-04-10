import spacy
from deep_translator import GoogleTranslator

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import User, TranslationSession, SentenceTranslation
from schemas import (
    TranslateRequest,
    TranslateOnlyResponse,  # Changed
    SentenceTranslationResponse,
    SUPPORTED_LANGUAGES,
)

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    raise RuntimeError(
        "spaCy model not found. Run: python -m spacy download en_core_web_sm"
    )

router = APIRouter(prefix="/api/translate", tags=["Translation"])

LANG_CODE_MAP = {
    "spanish": "es",
    "french": "fr",
    "chinese": "zh-CN",
    "german": "de",
    "portuguese": "pt",
    "japanese": "ja",
}


def split_sentences(text: str) -> list[str]:
    doc = nlp(text.strip())
    return [sent.text.strip() for sent in doc.sents if sent.text.strip()]


def translate_sentence(sentence: str, target_language: str) -> str:
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


def extract_lemma_and_pos(sentence: str) -> tuple[list[str], list[str]]:
    doc = nlp(sentence)
    lemmas: list[str] = []
    pos_tags: list[str] = []

    for token in doc:
        if token.is_space or token.is_punct:
            continue
        lemmas.append(token.lemma_)
        pos_tags.append(token.pos_)

    return lemmas, pos_tags


def build_title(passage: str) -> str:
    return passage[:15].strip() if len(passage) > 15 else passage.strip()


def build_passage_preview(passage: str) -> str:
    return passage[:100].strip() if len(passage) > 100 else passage.strip()


@router.get("/languages")
def get_languages(current_user: User = Depends(get_current_user)):
    return [
        {"code": lang, "name": lang.capitalize()}
        for lang in SUPPORTED_LANGUAGES
    ]


@router.post("", response_model=TranslateOnlyResponse, status_code=201)  # Changed
def translate_passage(
    body: TranslateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sentences = split_sentences(body.passage)

    if not sentences:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract any sentences from the passage.",
        )

    session_record = TranslationSession(
        user_id=current_user.id,
        title=build_title(body.passage),
        passage_preview=build_passage_preview(body.passage),
        full_passage=body.passage,
        target_language=body.targetLanguage,
    )
    db.add(session_record)

    try:
        db.commit()
        db.refresh(session_record)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create session: {str(e)}",
        )

    translation_records = []

    for idx, sentence in enumerate(sentences, start=1):
        translated_text = translate_sentence(sentence, body.targetLanguage)
        lemma_list, pos_list = extract_lemma_and_pos(sentence)

        record = SentenceTranslation(
            uid=idx,
            sentence=sentence,
            translation=translated_text,
            lemma=lemma_list,
            pos=pos_list,
            session_id=session_record.session_id,
        )
        db.add(record)
        translation_records.append(record)

    try:
        db.commit()
        for rec in translation_records:
            db.refresh(rec)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save translations: {str(e)}",
        )

    # Changed: Return only translations
    return TranslateOnlyResponse(
        sessionID=session_record.session_id,
        translations=[
            SentenceTranslationResponse(
                uid=rec.uid,
                sentence=rec.sentence,
                translation=rec.translation,
                lemma=", ".join(rec.lemma) if
            isinstance(rec.lemma, list) else rec.lemma,    
                pos=", ".join(rec.pos) if
            isinstance(rec.pos, list) else rec.pos,
            )
            for rec in translation_records
        ],
    )