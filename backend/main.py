from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ReadUp Backend", version="0.1.0")

origins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


@app.get("/health")
async def health_check() -> dict[str, str]:
  return {"status": "ok"}


@app.get("/")
async def root() -> dict[str, str]:
  return {"message": "Welcome to the ReadUp FastAPI backend"}

