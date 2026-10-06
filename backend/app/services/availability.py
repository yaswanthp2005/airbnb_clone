from __future__ import annotations

from datetime import date

from sqlalchemy import ColumnElement, and_

from app.models.booking import BOOKING_STATUS_CONFIRMED, Booking


def overlaps_confirmed_booking(check_in: date, check_out: date) -> ColumnElement[bool]:
    """Check-in is inclusive and checkout exclusive, so back-to-back stays don't clash."""
    return and_(
        Booking.status == BOOKING_STATUS_CONFIRMED,
        Booking.check_in < check_out,
        Booking.check_out > check_in,
    )
