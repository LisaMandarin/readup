# ReadUp Backend (FastAPI)

This backend is built with **FastAPI** and served using **Uvicorn**.
It connects to **Supabase** (PostgreSQL) for data storage.

## Local development setup

From the `backend` directory:

```bash
cd backend
cp .env.example .env        
pip install -r requirements.txt
```

The `cp .env.example .env` step is for local development only.
After copying, edit `.env` and replace the example values with your real credentials.

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT signing secret
- `CORS_ORIGINS`: comma-separated frontend origins
- `GEMINI_API_KEY`: Google Gemini API key for summary evaluation

Optional environment variables:

- `GEMINI_MODEL`: Gemini model name, defaults to `gemini-2.5-flash`

Example:

```env
DATABASE_URL=postgresql://username:password@host:5432/database_name
SECRET_KEY=replace-with-a-long-random-secret
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
GEMINI_API_KEY=replace-with-your-google-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
```

## Run the development server

```bash
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

- Docs (Swagger UI): `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Comprehension evaluation API

Authenticated users can evaluate a summary with:

```http
POST /api/comprehension/
Authorization: Bearer <token>
Content-Type: application/json
```

Example request body:

```json
{
  "passage": "Original passage text...",
  "summary": "Student summary text..."
}
```

Example response:

```json
{
  "score": 4,
  "advice": "Your summary captures the main point clearly..."
}
```

## Deploy on Render

Create a **Web Service** pointing at the `backend` directory.

- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- This backend does not use `spacy`; if the Render dashboard still runs a `python -m spacy ...` command from an older setup, remove it.

Do not create a `.env` file on Render. Set these environment variables in the Render dashboard:

- `DATABASE_URL`
- `SECRET_KEY`
- `CORS_ORIGINS`
- `GEMINI_API_KEY`
- `GEMINI_MODEL` (optional)

Example production `CORS_ORIGINS` value:

```env
https://your-frontend.onrender.com
```
