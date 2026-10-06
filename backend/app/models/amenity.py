from __future__ import annotations

from typing import TYPE_CHECKING, Optional

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.listing_amenity import ListingAmenity


class Amenity(Base):
    __tablename__ = "amenities"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    icon: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)

    listing_links: Mapped[list["ListingAmenity"]] = relationship(
        "ListingAmenity", back_populates="amenity", cascade="all, delete-orphan"
    )
