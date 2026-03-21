# ReadUp Backend (FastAPI)

This backend is built with **FastAPI** and served using **Uvicorn**.
It connects to **Supabase** (PostgreSQL) for data storage.

## Setup

From the `backend` directory:

```bash
cd backend
cp .env.example .env        
pip install -r requirements.txt
```

## Run the development server

```bash
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

- Docs (Swagger UI): `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

