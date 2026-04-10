from fastapi import APIRouter, Depends

from auth import get_current_user
from gemini_service import evaluate_summary
from models import User
from schemas import (
    ComprehensionRequest,
    ComprehensionResponse,
)

router = APIRouter(prefix="/api/comprehension", tags=["Comprehension"])


@router.post("/", response_model=ComprehensionResponse)
def evaluate_comprehension(
    body: ComprehensionRequest,
    current_user: User = Depends(get_current_user),
):
    """Evaluate a learner's summary against the original passage."""
    return evaluate_summary(body)
