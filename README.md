# ReadUp

ReadUp is a CSE499 Senior Project focused on helping English language learners improve reading comprehension and vocabulary through AI-assisted translation and lookup tools.

This repository is maintained by **Min-ting (Lisa) Chuang**, **Oluwatigbo Alao**, and **Johnathan Babb**.

## Project overview

The current application includes:

- account signup, email verification, sign in, and sign out
- passage translation into supported target languages
- sentence-level vocabulary lookup
- comprehension feedback on user-written summaries
- saved translation sessions with reload and delete flows

## Repository structure

- `frontend/`: React 19 + TypeScript + Vite application
- `backend/`: FastAPI + SQLAlchemy service
- Supabase PostgreSQL: primary database and auth integration

## Quick start

Start the backend first:

```bash
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload
```

Then start the frontend in a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Before running either app, create local `.env` files with the required variables described in:

- [frontend/README.md](/Users/lisachuang/Documents/BYUI/readup/frontend/README.md)
- [backend/README.md](/Users/lisachuang/Documents/BYUI/readup/backend/README.md)

Local development URLs:

- frontend: `http://localhost:5173`
- backend: `http://127.0.0.1:8000`
- backend docs: `http://127.0.0.1:8000/docs`

## Deployment

- frontend: Vercel
- backend: Render
- database/auth: Supabase

## Production URLs

- frontend: `https://readup-topaz.vercel.app`
- backend: `https://readup-backend.onrender.com`
- backend health check: `https://readup-backend.onrender.com/health`
