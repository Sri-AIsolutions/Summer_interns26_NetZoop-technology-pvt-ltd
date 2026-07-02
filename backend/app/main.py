import logging
from contextlib import asynccontextmanager

<<<<<<< HEAD
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
=======
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
>>>>>>> bf6f30f4f688adc078b4fe50d0695691bcee795c

from app.config import settings

from app.routers import admin, chat, compare, courses, curriculum, export, programs, search

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting %s", settings.app_name)
<<<<<<< HEAD
    from app.database import warm_db
    warm_db()
    logger.info("Database warm-up complete")
=======
>>>>>>> bf6f30f4f688adc078b4fe50d0695691bcee795c
    yield
    logger.info("Shutting down %s", settings.app_name)


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://curriculum-chatbot.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(search.router)
app.include_router(curriculum.router)
app.include_router(compare.router)
app.include_router(admin.router)
app.include_router(chat.router)
app.include_router(courses.router)
app.include_router(export.router)
app.include_router(programs.router)


@app.get("/health")
<<<<<<< HEAD
def health(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "app": settings.app_name}
    except Exception as e:
        return {"status": "degraded", "detail": str(e)}
=======
def health():
    return {"status": "healthy", "app": settings.app_name}
>>>>>>> bf6f30f4f688adc078b4fe50d0695691bcee795c
