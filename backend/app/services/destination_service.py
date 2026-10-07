from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Destination, Listing
from app.schemas.destination import DestinationOut


def list_destinations(db: Session) -> list[DestinationOut]:
    """Featured cities in display order, skipping any that currently have no listings."""
    has_listings = select(Listing.id).where(Listing.city == Destination.city).exists()
    destinations = db.scalars(
        select(Destination)
        .where(has_listings)
        .order_by(Destination.position.asc(), Destination.id.asc())
    )
    return [DestinationOut.model_validate(destination) for destination in destinations]
