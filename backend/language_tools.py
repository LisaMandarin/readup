import spacy

from fastapi import HTTPException, status


LANG_CODE_MAP = {
    "spanish": "es",
    "french": "fr",
    "chinese": "zh-CN",
    "german": "de",
    "portuguese": "pt",
    "japanese": "ja",
}


try:
    nlp = spacy.load("en_core_web_sm")
except OSError as exc:
    raise RuntimeError(
        "spaCy model not found. Run: python -m spacy download en_core_web_sm"
    ) from exc


def get_target_language_code(target_language: str) -> str:
    lang_code = LANG_CODE_MAP.get(target_language.lower())
    if not lang_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported language: '{target_language}'",
        )
    return lang_code
