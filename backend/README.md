# ReadUp Backend

ReadUp backend is a FastAPI application backed by PostgreSQL via SQLAlchemy.

It currently handles:

- app authentication endpoints layered on top of Supabase Auth
- translation session creation and retrieval
- word lookup enrichment through Gemini
- comprehension scoring through Gemini
- persistent sentence translations and lookup results

## Stack

- FastAPI + Uvicorn
- SQLAlchemy + PostgreSQL
- Supabase Auth
- spaCy `en_core_web_sm` for English sentence splitting and vocab extraction
- `deep-translator` for sentence translation
- Gemini for lookup/comprehension responses

## Required environment variables

Create `backend/.env` with:

```env
DATABASE_URL=postgresql://username:password@host:5432/database_name
SECRET_KEY=replace-with-a-long-random-secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-service-role-or-api-key
GEMINI_API_KEY=your-google-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
```

Notes:

- `DATABASE_URL` is required at import time by `database.py`.
- `SECRET_KEY`, `SUPABASE_URL`, and `SUPABASE_KEY` are required at import time by `auth.py`.
- `GEMINI_API_KEY` is required when calling lookup/comprehension features.
- `GEMINI_MODEL` is optional and defaults to `gemini-2.5-flash`.

## Install

From `backend/`:

```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

The repository currently includes `spacy` in `requirements.txt`, and `language_tools.py` will raise an error if the `en_core_web_sm` model is missing.

## Run locally

```bash
cd backend
uvicorn main:app --reload
```

Local URLs:

- API root: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`
- Health check: `GET /health`

## Current routes

Authentication:

- `POST /auth/signup`
- `POST /auth/verify`
- `POST /auth/resend`
- `POST /auth/signin`
- `GET /auth/me`

Translation:

- `GET /api/translate/languages`
- `POST /api/translate`

Lookup:

- `POST /api/lookup`

Comprehension:

- `POST /api/comprehension/`

Sessions:

- `GET /api/sessions`
- `GET /api/sessions/{session_id}`
- `PUT /api/sessions/{session_id}`
- `DELETE /api/sessions/{session_id}`
- `DELETE /api/sessions/{session_id}/sentences/{uid}`
- `DELETE /api/sessions/{session_id}/lookup-results/{lookup_result_id}`

## Important implementation notes

- Database tables are created automatically on startup via `Base.metadata.create_all(bind=engine)` in `main.py`.
- CORS is currently hardcoded in `main.py` to allow only:
  - `http://localhost:5173`
  - `http://127.0.0.1:5173`
- `CORS_ORIGINS` is not currently read from environment variables, so deployment changes require editing `main.py`.

## Deploy notes

If you deploy this backend, make sure the runtime has:

- all environment variables above
- the spaCy package and `en_core_web_sm` model installed
- network access to Supabase, Gemini, and the translation provider used by `deep-translator`
