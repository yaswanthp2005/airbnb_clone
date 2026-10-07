from __future__ import annotations

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Destination(Base):
    """A featured city on the home page; listings link to it by city name."""

    __tablename__ = "destinations"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    city: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    state: Mapped[str] = mapped_column(String(80), nullable=False)
    country: Mapped[str] = mapped_column(String(80), nullable=False, default="India")
    tagline: Mapped[str] = mapped_column(String(120), nullable=False)
    image_url: Mapped[str] = mapped_column(String(512), nullable=False)
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0, index=True)
