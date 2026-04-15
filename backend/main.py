import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from database import Base, engine
from routers.auth_router import router as auth_router
from routers.translate_router import router as translation_router
from routers.lookup_router import router as lookup_router
from routers.comprehension_router import router as comprehension_router
from routers.sessions_router import router as sessions_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ReadUp Backend", version="0.1.0")

cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
)
origins = [
    origin.strip()
    for origin in cors_origins.split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(translation_router)
app.include_router(lookup_router)

app.include_router(comprehension_router)
app.include_router(sessions_router)


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Welcome to the ReadUp FastAPI backend"}
