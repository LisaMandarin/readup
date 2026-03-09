# ReadUp

This is a collaborative repository shared by **Min-ting (Lisa) Chuang** and **Oluwatigbo Alao** for the course **CSE499 Senior Project**.  

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
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`, with docs at `http://127.0.0.1:8000/docs`.

### 3. Frontend setup (React + Vite)

In a separate terminal, from the project root:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.  
When both frontend and backend are running, the **“Call Backend Health Check”** button on the homepage will call the FastAPI `/health` endpoint and display its status.

---

## More details

- Frontend instructions: see `frontend/README.md`
- Backend instructions: see `backend/README.md`

