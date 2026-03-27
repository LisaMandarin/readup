import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers.auth_router import router as auth_router
from routers.translate_router import router as translate_router

# Create tables in Supabase if they don't exist yet
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ReadUp Backend", version="0.1.0")


def get_allowed_origins() -> list[str]:
    """Read comma-separated CORS origins from the environment."""
    cors_origins = os.getenv("CORS_ORIGINS")
    if cors_origins:
        return [
            origin.strip()
            for origin in cors_origins.split(",")
            if origin.strip()
        ]

    return [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]


origins = get_allowed_origins()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(translate_router)


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Welcome to the ReadUp FastAPI backend"}
