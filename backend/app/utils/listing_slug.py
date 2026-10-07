from __future__ import annotations

import re

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.listing import Listing

MAX_SLUG_LENGTH = 220
_SLUG_RE = re.compile(r"[^a-z0-9]+")


def slugify_title(title: str) -> str:
    base = _SLUG_RE.sub("-", title.lower()).strip("-")
    return (base[:MAX_SLUG_LENGTH] or "listing").strip("-")


def next_unique_slug(db: Session, title: str) -> str:
    """Match TaskBoard: first listing keeps the bare slug; duplicates get `-2`, `-3`, …"""
    base = slugify_title(title)
    if db.scalar(select(Listing.id).where(Listing.slug == base)) is None:
        return base
    suffix = 2
    while db.scalar(select(Listing.id).where(Listing.slug == f"{base}-{suffix}")) is not None:
        suffix += 1
    return f"{base}-{suffix}"
