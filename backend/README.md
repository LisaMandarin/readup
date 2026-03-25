# ReadUp Backend (FastAPI)

This backend is built with **FastAPI** and served using **Uvicorn**.
It connects to **Supabase** (PostgreSQL) for data storage.

## Setup

From the `backend` directory:

```bash
cd backend
pip install -r requirements.txt
```

Create a local `.env` file from the example:

```powershell
Copy-Item .env.example .env
```

Then update `.env` with:

- `SECRET_KEY`: any long random string used to sign JWTs
- `DATABASE_URL`: your PostgreSQL connection string

If you are using Supabase, get the Postgres connection string from:

- Supabase dashboard
- Project Settings
- Database
- Connection string

Use the direct Postgres URL or pooler URL provided by Supabase.

## Run the development server

```bash
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

- Docs (Swagger UI): `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`
- App health: `http://127.0.0.1:8000/health`
- Database health: `http://127.0.0.1:8000/health/db`

If the database is reachable when the app starts, the backend will create the
`users` table automatically if it does not already exist.

