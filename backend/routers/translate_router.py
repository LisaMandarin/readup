from fastapi import APIRouter, Depends, HTTPException, status
from deep_translator import GoogleTranslator

from schemas import TranslateRequest, TranslateResponse, LanguageResponse
from auth import get_current_user
from models import User

router = APIRouter(prefix="/translate", tags=["Translation"])

# ── Supported languages (subset for clean UI) ─────────────

SUPPORTED_LANGUAGES = {
    "af": "Afrikaans",
    "ar": "Arabic",
    "bg": "Bulgarian",
    "bn": "Bengali",
    "ca": "Catalan",
    "cs": "Czech",
    "da": "Danish",
    "de": "German",
    "el": "Greek",
    "en": "English",
    "es": "Spanish",
    "et": "Estonian",
    "fa": "Persian",
    "fi": "Finnish",
    "fr": "French",
    "gu": "Gujarati",
    "he": "Hebrew",
    "hi": "Hindi",
    "hr": "Croatian",
    "hu": "Hungarian",
    "id": "Indonesian",
    "it": "Italian",
    "ja": "Japanese",
    "kn": "Kannada",
    "ko": "Korean",
    "lt": "Lithuanian",
    "lv": "Latvian",
    "ml": "Malayalam",
    "mr": "Marathi",
    "ms": "Malay",
    "nl": "Dutch",
    "no": "Norwegian",
    "pl": "Polish",
    "pt": "Portuguese",
    "ro": "Romanian",
    "ru": "Russian",
    "sk": "Slovak",
    "sl": "Slovenian",
    "sq": "Albanian",
    "sv": "Swedish",
    "sw": "Swahili",
    "ta": "Tamil",
    "te": "Telugu",
    "th": "Thai",
    "tl": "Filipino",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "vi": "Vietnamese",
    "yo": "Yoruba",
    "zh-CN": "Chinese (Simplified)",
    "zh-TW": "Chinese (Traditional)",
}


@router.get("/languages", response_model=list[LanguageResponse])
def get_languages(current_user: User = Depends(get_current_user)):
    """Return all supported languages."""
    return [
        LanguageResponse(code=code, name=name)
        for code, name in sorted(SUPPORTED_LANGUAGES.items(), key=lambda x: x[1])
    ]


@router.post("/", response_model=TranslateResponse)
def translate_text(
    body: TranslateRequest,
    current_user: User = Depends(get_current_user),
):
    """Translate text from source language to target language."""

    # Validate target language
    if body.target_language not in SUPPORTED_LANGUAGES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported target language: '{body.target_language}'. "
                   f"Use GET /translate/languages for supported codes.",
        )

    # Validate source language (if not auto)
    if body.source_language != "auto" and body.source_language not in SUPPORTED_LANGUAGES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported source language: '{body.source_language}'.",
        )

    try:
        translator = GoogleTranslator(
            source=body.source_language,
            target=body.target_language,
        )
        translated = translator.translate(body.text)

        if not translated:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Translation returned empty result",
            )

        return TranslateResponse(
            original_text=body.text,
            translated_text=translated,
            source_language=body.source_language,
            target_language=body.target_language,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Translation failed: {str(e)}",
        )