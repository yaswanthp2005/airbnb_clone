from __future__ import annotations

from sqlalchemy import event
from sqlalchemy.orm import Session as SASession

from app.models.listing import Listing
from app.utils.listing_slug import next_unique_slug


@event.listens_for(Listing, "before_insert")
def assign_listing_slug(_mapper, _connection, target: Listing) -> None:
    if target.slug:
        return
    session = SASession.object_session(target)
    if session is None:
        return
    target.slug = next_unique_slug(session, target.title)
