import logging

from sqlalchemy import inspect, select, text

from app import models  # noqa: F401 — register metadata
from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.models.listing import Listing
from app.seed import run_seed, seed_destinations
from app.utils.listing_slug import next_unique_slug

# uvicorn only configures its own loggers; reuse its error logger so this shows in host logs.
logger = logging.getLogger("uvicorn.error")


def _ensure_listing_slugs() -> None:
    inspector = inspect(engine)
    if "listings" not in inspector.get_table_names():
        return
    columns = {column["name"] for column in inspector.get_columns("listings")}
    if "slug" not in columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE listings ADD COLUMN slug VARCHAR(220)"))
        db = SessionLocal()
        try:
            for listing in db.scalars(select(Listing).order_by(Listing.id)):
                if not listing.slug:
                    listing.slug = next_unique_slug(db, listing.title)
                    db.flush()
            db.commit()
        finally:
            db.close()
        with engine.begin() as connection:
            connection.execute(
                text("CREATE UNIQUE INDEX IF NOT EXISTS ix_listings_slug ON listings (slug)")
            )


def init_database() -> None:
    Base.metadata.create_all(bind=engine)
    _ensure_listing_slugs()
    if not settings.seed_on_startup:
        return
    db = SessionLocal()
    try:
        if run_seed(db):
            logger.info("Seeded demo data into an empty database")
        if seed_destinations(db):
            logger.info("Seeded featured destinations")
    finally:
        db.close()
