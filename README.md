# ReadUp

This is a collaborative repository shared by **Min-ting (Lisa) Chuang** and **Oluwatigbo Alao** and **Johnathan Babb** for the course **CSE499 Senior Project**.

ReadUp aims to support **English language learners** by enhancing their reading comprehension and expanding their vocabulary through **AI-powered interactive learning tools**.

---

## Project structure

- `frontend/` – React + TypeScript + Vite app
  - Uses **Tailwind CSS** for styling
  - Uses **Ant Design (antd)** for UI components
  - Includes a demo page that can call the backend `/health` endpoint
- `backend/` – **FastAPI** service (Python)
  - Provides a basic root endpoint `/` and a health check `/health`
  - Configured with CORS to allow requests from the Vite dev server
- `database` – **Supabase PostgreSQL**
  - Stores application data for the FastAPI backend

---

## Getting started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd readup
```

### 2. Backend setup (FastAPI)

```bash
cd backend
cp .env.example .env
pip install -r requirements.txt
uvicorn main:app --reload
```

After copying `.env.example`, edit `.env` and replace the example values with your real credentials.

The API will be available at `http://127.0.0.1:8000`, with docs at `http://127.0.0.1:8000/docs`.

### 3. Frontend setup (React + Vite)

In a separate terminal, from the project root:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

After copying `.env.example`, edit `.env` and set:

- `VITE_API_BASE_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The frontend will be available at `http://localhost:5173`.  
When both frontend and backend are running, the **“Call Backend Health Check”** button on the homepage will call the FastAPI `/health` endpoint and display its status.

---

## More details

- Frontend instructions: see `frontend/README.md`
- Backend instructions: see `backend/README.md`

## Deployment notes

- Frontend: deploy the `frontend/` app to Vercel with `frontend` as the root directory
- Backend: deploy the `backend/` app to Render as a Web Service
- Database: Supabase PostgreSQL

## Production URLs

- Frontend: `https://readup-topaz.vercel.app`
- Backend: `https://readup-backend.onrender.com`
- Backend health check: `https://readup-backend.onrender.com/health`

## Favorite Quotes

- If you fail to plan, you plan to fail.

- As long as Oluwa is involved. #oluwatigboalao11

- "The most important step a man can take is always the next one" - Dallinar Kholin
