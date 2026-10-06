from app.core.database import Base, SessionLocal, engine
from app import models  # noqa: F401 — register metadata
from app.seed import run_seed


def init_database() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        run_seed(db)
    finally:
        db.close()
