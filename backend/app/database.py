<<<<<<< HEAD
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

engine = create_engine(
    settings.database_url,
    pool_size=5,
    max_overflow=10,
    pool_recycle=300,
    pool_pre_ping=True,
)
=======
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

engine = create_engine(settings.database_url, pool_pre_ping=True)
>>>>>>> bf6f30f4f688adc078b4fe50d0695691bcee795c
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
<<<<<<< HEAD


def warm_db():
    """Lightweight query to keep Neon compute from suspending."""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception:
        pass
=======
>>>>>>> bf6f30f4f688adc078b4fe50d0695691bcee795c
