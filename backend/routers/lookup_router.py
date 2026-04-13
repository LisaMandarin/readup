# routers/lookup_router.py

import httpx
import spacy
from deep_translator import GoogleTranslator

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import User
from schemas import LookupType, WordLookupRequest, WordLookupResponse

# Reuse the same spaCy model already used in translate_router
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    raise RuntimeError(
        "spaCy model not found. Run: python -m spacy download en_core_web_sm"
    )

router = APIRouter(prefix="/api/lookup", tags=["Lookup"])

# Same map as translate_router — keep consistent
LANG_CODE_MAP = {
    "spanish": "es",
    "french": "fr",
    "chinese": "zh-CN",
    "german": "de",
    "portuguese": "pt",
    "japanese": "ja",
}

# ─────────────────────────────────────────────
# CEFR word lists (A1 → C2, simple approach)
# Source: https://www.examenglish.com/vocabulary
# These are small representative sets — expand as needed
# ─────────────────────────────────────────────
CEFR_LEVELS: dict[str, set[str]] = {
    "A1": {
        "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
        "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
        "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
        "an", "will", "my", "one", "all", "would", "there", "their", "what",
        "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
        "cat", "dog", "house", "car", "book", "eat", "drink", "go", "come",
        "big", "small", "good", "bad", "yes", "no", "hello", "goodbye",
        "name", "day", "time", "year", "man", "woman", "child", "school",
    },
    "A2": {
        "able", "about", "above", "across", "after", "again", "age",
        "already", "also", "always", "another", "answer", "any", "area",
        "ask", "back", "because", "become", "before", "begin", "behind",
        "believe", "better", "between", "both", "bring", "buy", "call",
        "change", "city", "close", "colour", "come", "could", "country",
        "different", "easy", "enjoy", "enough", "every", "example", "far",
        "feel", "few", "find", "follow", "food", "friend", "give", "happy",
        "help", "here", "home", "hope", "hour", "however", "important",
        "keep", "know", "large", "later", "learn", "leave", "let", "life",
        "like", "little", "live", "long", "look", "love", "make", "many",
        "mean", "meet", "money", "more", "most", "move", "much", "must",
        "need", "never", "new", "next", "night", "now", "number", "often",
        "only", "open", "other", "over", "own", "part", "people", "place",
        "play", "please", "point", "possible", "put", "read", "really",
        "remember", "same", "see", "seem", "send", "show", "side", "since",
        "some", "soon", "speak", "start", "still", "stop", "story", "such",
        "sure", "take", "talk", "tell", "than", "then", "think", "through",
        "together", "too", "try", "turn", "under", "until", "use", "very",
        "want", "way", "well", "when", "where", "while", "why", "without",
        "work", "world", "write", "young",
    },
    "B1": {
        "achieve", "affect", "agree", "allow", "although", "apply",
        "approach", "arrange", "attention", "available", "avoid", "build",
        "cause", "chance", "character", "check", "choice", "claim", "clear",
        "collect", "compare", "complete", "concern", "condition", "connect",
        "consider", "continue", "control", "correct", "create", "deal",
        "decide", "describe", "design", "develop", "difficult", "discuss",
        "effect", "effort", "either", "else", "encourage", "environment",
        "especially", "event", "experience", "explain", "express", "fail",
        "final", "form", "future", "general", "group", "grow", "happen",
        "health", "high", "history", "however", "identify", "improve",
        "include", "increase", "information", "instead", "interest",
        "involve", "issue", "kind", "knowledge", "language", "law", "lead",
        "level", "list", "local", "main", "manage", "matter", "method",
        "mind", "miss", "modern", "natural", "notice", "offer", "often",
        "opinion", "order", "organize", "particular", "perform", "period",
        "plan", "position", "prepare", "present", "problem", "process",
        "produce", "protect", "prove", "provide", "reason", "receive",
        "recent", "reduce", "relate", "report", "require", "research",
        "result", "return", "role", "rule", "serious", "set", "situation",
        "size", "skill", "society", "solve", "space", "spend", "stand",
        "structure", "subject", "success", "suggest", "support", "system",
        "technology", "test", "therefore", "throughout", "type", "understand",
        "value", "various", "view", "wait", "whole",
    },
    "B2": {
        "abandon", "abstract", "accurate", "acquire", "adapt", "adequate",
        "adjust", "administration", "admit", "adopt", "advance", "advocate",
        "allocate", "alter", "ambiguous", "analyze", "anticipate", "apparent",
        "assess", "assume", "attitude", "authority", "benefit", "capable",
        "capacity", "category", "challenge", "circumstance", "collaborate",
        "commit", "communicate", "complex", "component", "concept",
        "conclude", "conduct", "conflict", "consequence", "consistent",
        "construct", "context", "contribute", "controversial", "convert",
        "convince", "correspond", "criteria", "culture", "decade", "decline",
        "define", "demonstrate", "derive", "determine", "distinction",
        "distribute", "diverse", "dominate", "economy", "element",
        "eliminate", "emerge", "emphasis", "enable", "establish", "evaluate",
        "evident", "evolve", "exception", "expand", "expose", "extent",
        "factor", "feature", "flexible", "focus", "framework", "function",
        "global", "highlight", "hypothesis", "implement", "imply", "indicate",
        "individual", "influence", "initiative", "insight", "integrate",
        "interpret", "investigate", "justify", "maintain", "mechanism",
        "monitor", "motivation", "obtain", "outcome", "parameter",
        "participate", "perceive", "perspective", "phenomenon", "policy",
        "potential", "precise", "primary", "principle", "priority", "promote",
        "proportion", "pursue", "rational", "recognize", "reflect", "reform",
        "reject", "relevant", "rely", "represent", "resource", "response",
        "reveal", "sector", "seek", "significant", "specific", "strategy",
        "sufficient", "summarize", "theory", "transfer", "transform",
        "transition", "trend", "utilize", "valid", "variable",
    },
    "C1": {
        "abolish", "accelerate", "accommodate", "accumulate", "acknowledge",
        "affiliate", "aggregate", "alleviate", "ambivalent", "amplify",
        "analogous", "articulate", "assertion", "attribute", "augment",
        "autonomous", "coherent", "collaborate", "compel", "compensate",
        "complement", "comprehensive", "concede", "conceptualize",
        "consolidate", "contemplate", "contradict", "controversial",
        "conviction", "cooperate", "correlation", "counterpart", "critique",
        "deduce", "deliberate", "depict", "derive", "designate", "detect",
        "differentiate", "dilemma", "diminish", "discriminate", "disparity",
        "disseminate", "distinction", "dominant", "elaborate", "empirical",
        "encompass", "enhance", "ensure", "equate", "ethical", "explicit",
        "facilitate", "fluctuate", "formulate", "generate", "govern",
        "hierarchical", "hypothesis", "illustrate", "implicit", "incorporate",
        "inherent", "inhibit", "innovative", "integrity", "intervene",
        "invoke", "legislate", "manifest", "mediate", "modify", "negate",
        "negotiate", "nonetheless", "objective", "obscure", "overlap",
        "paradigm", "perceive", "persist", "postulate", "pragmatic",
        "predominant", "presuppose", "prioritize", "profound", "reinforce",
        "rhetoric", "rigorous", "simulate", "sophisticated", "stimulate",
        "subsequent", "sustain", "synthesize", "systematize", "terminate",
        "theoretical", "undermine", "virtually", "widespread",
    },
    "C2": {
        "abstruse", "acrimony", "adumbrate", "ameliorate", "anachronism",
        "anomalous", "antithetical", "arcane", "arduous", "assiduous",
        "attenuate", "auspicious", "axiomatic", "bellicose", "bifurcate",
        "byzantine", "cacophonous", "capitulate", "capricious", "cavalier",
        "circumlocution", "clandestine", "cogent", "commensurate",
        "compendious", "conciliatory", "conflagration", "convoluted",
        "corroborate", "covert", "culpable", "cursory", "dearth",
        "debilitate", "decorum", "deferential", "deleterious", "delineate",
        "demagogue", "deprecate", "derogatory", "desiccate", "diaphanous",
        "didactic", "diffidence", "digress", "dilettante", "discern",
        "dissonant", "dogmatic", "ebullient", "efficacious", "egregious",
        "elusive", "embroil", "endemic", "enigmatic", "ephemeral",
        "equivocal", "esoteric", "evanescent", "exacerbate", "exorbitant",
        "exquisite", "extrapolate", "facetious", "fastidious", "fatuous",
        "fervid", "furtive", "gratuitous", "hegemony", "heretical",
        "idiosyncratic", "impetuous", "incisive", "incongruent", "indolent",
        "inimical", "insidious", "intransigent", "inveterate", "juxtapose",
        "loquacious", "magnanimous", "malevolent", "mendacious", "mercurial",
        "meticulous", "mitigate", "morose", "nascent", "nebulous",
        "nefarious", "obfuscate", "obsequious", "obstinate", "omniscient",
        "onerous", "ostensible", "pernicious", "perspicacious", "pertinacious",
        "plausible", "polemical", "pragmatic", "precarious", "precipitate",
        "predilection", "preposterous", "probity", "procrastinate",
        "profligate", "propitious", "puerile", "pugnacious", "querulous",
        "recalcitrant", "recondite", "redolent", "refractory", "reprehensible",
        "sagacious", "salient", "sanguine", "sycophant", "taciturn",
        "tenacious", "torpid", "truculent", "ubiquitous", "vacuous",
        "venerate", "verbose", "vicarious", "vindictive", "volatile",
        "voracious", "whimsical", "zealous",
    },
}


def get_cefr_level(word: str) -> str:
    """
    Look up a word's CEFR level.
    Checks the lemma form so 'running' matches 'run' etc.
    Falls back to spaCy lemmatization before lookup.
    """
    word_lower = word.lower().strip()

    # Try lemma first via spaCy
    doc = nlp(word_lower)
    lemma = doc[0].lemma_ if doc else word_lower

    for level in ["A1", "A2", "B1", "B2", "C1", "C2"]:
        if word_lower in CEFR_LEVELS[level] or lemma in CEFR_LEVELS[level]:
            return level

    # Word not found in any list — make a reasonable guess based on
    # word length and morphological complexity as a rough heuristic
    if len(word_lower) <= 4:
        return "A2"
    elif len(word_lower) <= 6:
        return "B1"
    elif len(word_lower) <= 9:
        return "B2"
    else:
        return "C1"


def fetch_english_definition(word: str) -> str:
    """
    Fetch definition from the free DictionaryAPI.dev.
    No API key required.
    """
    url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{word.lower().strip()}"

    try:
        with httpx.Client(timeout=5.0) as client:
            response = client.get(url)

        if response.status_code == 404:
            return f'No dictionary definition found for "{word}".'

        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Dictionary API returned status {response.status_code}",
            )

        data = response.json()

        # Walk the nested structure: entries → meanings → definitions
        for entry in data:
            for meaning in entry.get("meanings", []):
                for definition in meaning.get("definitions", []):
                    defn = definition.get("definition", "").strip()
                    if defn:
                        # Return first valid definition with its part of speech
                        pos = meaning.get("partOfSpeech", "")
                        pos_label = f"({pos}) " if pos else ""
                        return f"{pos_label}{defn}"

        return f'Definition not available for "{word}".'

    except HTTPException:
        raise
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Dictionary API timed out. Please try again.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch definition: {str(e)}",
        )


def translate_word(word: str, target_language: str) -> str:
    """
    Translate a single word using GoogleTranslator.
    Same approach as translate_router but for a single word/phrase.
    """
    lang_code = LANG_CODE_MAP.get(target_language.lower())

    if not lang_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported language: '{target_language}'. "
                   f"Supported: {list(LANG_CODE_MAP.keys())}",
        )

    try:
        translator = GoogleTranslator(source="en", target=lang_code)
        translated = translator.translate(word.strip())

        if not translated:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Translation returned an empty result.",
            )

        return translated

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Translation failed: {str(e)}",
        )


def build_example_sentence(word: str, context: str | None) -> str:
    """
    Build an example sentence using the context sentence if available,
    otherwise fall back to a template using spaCy POS info.
    """
    # If we have a real context sentence, return it cleaned up
    if context and len(context.strip()) > len(word):
        sentence = context.strip()
        # Ensure it ends with punctuation
        if sentence and sentence[-1] not in ".!?":
            sentence += "."
        return sentence

    # No context — build a generic template based on POS
    doc = nlp(word.strip())
    if not doc:
        return f'Example: "I encountered the word {word} while reading."'

    token = doc[0]
    pos = token.pos_

    templates = {
        "NOUN":  f'The {word} was clearly visible to everyone in the room.',
        "VERB":  f'She decided to {word} as quickly as she could.',
        "ADJ":   f'The situation seemed quite {word} to all of us.',
        "ADV":   f'He completed the task {word} and without hesitation.',
    }

    return templates.get(pos, f'The word "{word}" appeared in the passage.')


# ─────────────────────────────────────────────
# Route
# ─────────────────────────────────────────────

@router.post("", response_model=WordLookupResponse)
def word_lookup(
    body: WordLookupRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    word = body.word.strip()

    if not word:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Word cannot be empty.",
        )

    if len(word.split()) > 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lookup is limited to 4 words or fewer.",
        )

    # ── Route to the correct handler ──────────────────────────────────────
    if body.lookup_type == LookupType.english_definition:
        result = fetch_english_definition(word)

    elif body.lookup_type == LookupType.spanish_translation:
        result = translate_word(word, body.target_language)

    elif body.lookup_type == LookupType.example_sentence:
        result = build_example_sentence(word, body.context)

    elif body.lookup_type == LookupType.cefr_level:
        level = get_cefr_level(word)
        level_descriptions = {
            "A1": "beginner — one of the most basic words in English.",
            "A2": "elementary — common in everyday simple conversations.",
            "B1": "intermediate — used regularly in general contexts.",
            "B2": "upper-intermediate — found in complex texts and discussions.",
            "C1": "advanced — used by proficient speakers in formal contexts.",
            "C2": "mastery — sophisticated vocabulary used by near-native speakers.",
        }
        description = level_descriptions.get(level, "")
        result = f"{level} – {description}"

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown lookup type: {body.lookup_type}",
        )

    return WordLookupResponse(
        word=word,
        lookup_type=body.lookup_type,
        result=result,
    )