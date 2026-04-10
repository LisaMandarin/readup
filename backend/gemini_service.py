import json
import os
from typing import Any, cast
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from dotenv import load_dotenv
from fastapi import HTTPException, status

from schemas import (
    ComprehensionRequest,
    ComprehensionResponse,
)

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")


def _require_dict(value: Any, name: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise ValueError(f"{name} must be an object")
    return cast(dict[str, Any], value)


def _require_list(value: Any, name: str) -> list[Any]:
    if not isinstance(value, list):
        raise ValueError(f"{name} must be a list")
    return cast(list[Any], value)


def _require_str(value: Any, name: str) -> str:
    if not isinstance(value, str):
        raise ValueError(f"{name} must be a string")
    return value


def _build_prompt(body: ComprehensionRequest) -> str:
    return f"""
You are an English reading comprehension evaluator for a language-learning app.

Compare the student's summary against the original passage.
Evaluate the summary based on:
1. Accuracy
2. Completeness
3. Clarity

Score the summary from 1 to 5:
- 5 = highly accurate, complete, and clear
- 4 = mostly accurate with minor omissions
- 3 = partially accurate with notable omissions
- 2 = major misunderstandings or weak coverage
- 1 = largely incorrect, irrelevant, or very incomplete

Write advice in simple English only, around 100 words.
The advice should:
- explain what the student understood well
- point out missing or incorrect ideas
- suggest how to improve the summary

Return JSON only using this exact shape:
{{
  "score": 1,
  "advice": "..."
}}

Original passage:
\"\"\"
{body.passage}
\"\"\"

Student summary:
\"\"\"
{body.summary}
\"\"\"
""".strip()


def evaluate_summary(
    body: ComprehensionRequest,
) -> ComprehensionResponse:
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GEMINI_API_KEY is not configured",
        )

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    )
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": _build_prompt(body),
                    }
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
        },
    }
    request = Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urlopen(request, timeout=30) as response:
            raw_response = _require_dict(
                json.loads(response.read().decode("utf-8")),
                "Gemini response",
            )
    except HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Gemini API error: {detail or exc.reason}",
        )
    except URLError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to reach Gemini API: {exc.reason}",
        )

    try:
        candidates = _require_list(raw_response.get("candidates"), "candidates")
        first_candidate = _require_dict(candidates[0], "candidate")
        content = _require_dict(first_candidate.get("content"), "content")
        parts = _require_list(content.get("parts"), "parts")
        first_part = _require_dict(parts[0], "part")
        response_text = _require_str(first_part.get("text"), "text")
        parsed_response = json.loads(response_text)
        if not isinstance(parsed_response, dict):
            raise ValueError("Model output must be a JSON object")
        return ComprehensionResponse(**parsed_response)
    except (KeyError, IndexError, TypeError, json.JSONDecodeError, ValueError) as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Invalid Gemini response format: {exc}",
        )
