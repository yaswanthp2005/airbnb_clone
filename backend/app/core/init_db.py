import logging

from app import models  # noqa: F401 — register metadata
from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.seed import run_seed

# uvicorn only configures its own loggers; reuse its error logger so this shows in host logs.
logger = logging.getLogger("uvicorn.error")


def init_database() -> None:
    Base.metadata.create_all(bind=engine)
    if not settings.seed_on_startup:
        return
    db = SessionLocal()
    try:
        if run_seed(db):
            logger.info("Seeded demo data into an empty database")
    finally:
        db.close()
