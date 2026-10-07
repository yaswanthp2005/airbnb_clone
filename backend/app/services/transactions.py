from __future__ import annotations

from sqlalchemy import text
from sqlalchemy.orm import Session


def begin_write(db: Session) -> None:
    """
    SQLite has no row locks, so take the database write lock up front; other databases rely on
    the `SELECT … FOR UPDATE` that follows.
    """
    if db.get_bind().dialect.name == "sqlite":
        db.execute(text("BEGIN IMMEDIATE"))
