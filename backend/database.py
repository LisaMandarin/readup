import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not set. "
        "Copy .env.example to .env and add your Supabase connection string."
    )

normalized_database_url = DATABASE_URL.replace(
    "postgres://", "postgresql://", 1
)

engine = create_engine(normalized_database_url, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def check_database_connection() -> None:
    """Raise immediately if the configured database is unreachable."""
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))


def get_db():
    """FastAPI dependency — yields a DB session, closes it when done."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()