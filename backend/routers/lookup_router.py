# routers/lookup_router.py

from fastapi import APIRouter, Depends

from auth import get_current_user
from gemini_service import ai_fill_vocab_fields
from models import User
from schemas import WordLookupRequest, WordLookupResponse

router = APIRouter(prefix="/api/lookup", tags=["Lookup"])


@router.post("", response_model=WordLookupResponse)
def ai_vocab_lookup(
    body: WordLookupRequest,
    current_user: User = Depends(get_current_user),
):
    result = ai_fill_vocab_fields(
        lemma=body.lemma,
        pos=body.pos,
        targetLanguage=body.target_language,
        options=body.options,
    )
    return WordLookupResponse(
        word=body.word,
        lemma=body.lemma,
        pos=body.pos,
        target_language=body.target_language,
        translation=result["translation"],
        definition=result["definition"],
        example=result["example"],
        level=result["level"],
    )
