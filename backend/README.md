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

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT signing secret
- `CORS_ORIGINS`: comma-separated frontend origins

Example:

```env
DATABASE_URL=postgresql://username:password@host:5432/database_name
SECRET_KEY=replace-with-a-long-random-secret
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

## Run the development server

```bash
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

- Docs (Swagger UI): `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Deploy on Render

Create a **Web Service** pointing at the `backend` directory.

- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

Set these environment variables in Render:

- `DATABASE_URL`
- `SECRET_KEY`
- `CORS_ORIGINS`

Example production `CORS_ORIGINS` value:

```env
https://your-frontend.onrender.com
```
