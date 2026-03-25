from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from database import Base, check_database_connection, engine
from routers.auth_router import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    check_database_connection()
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(title="ReadUp Backend", version="0.1.0", lifespan=lifespan)

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

app.include_router(auth_router)


@app.get("/health")
async def health_check() -> dict[str, str]:
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}


@app.get("/health/db")
async def database_health_check() -> dict[str, str]:
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Welcome to the ReadUp FastAPI backend"}