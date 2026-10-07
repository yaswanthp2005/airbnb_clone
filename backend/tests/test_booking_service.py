from datetime import date

import pytest
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.booking import BOOKING_STATUS_CANCELLED, BOOKING_STATUS_CONFIRMED, Booking
from app.schemas.booking import BookingCreate
from app.services.booking_service import cancel_booking, create_booking, is_stay_over


def test_is_stay_over_on_checkout_day():
    booking = Booking(
        listing_id=1,
        guest_id=1,
        check_in=date(2025, 1, 1),
        check_out=date(2025, 1, 5),
        guests=1,
        nightly_price=1000,
        cleaning_fee=0,
        service_fee=0,
        total_price=4000,
        status=BOOKING_STATUS_CONFIRMED,
    )
    assert is_stay_over(booking, date(2025, 1, 5)) is True
    assert is_stay_over(booking, date(2025, 1, 4)) is False


def test_create_booking_rejects_overlap(db: Session, guest_user, sample_listing):
    from tests.conftest import future_date

    check_in = future_date(10)
    check_out = future_date(13)
    payload = BookingCreate(
        listing_id=sample_listing.id,
        check_in=check_in,
        check_out=check_out,
        guests=2,
    )
    create_booking(db, guest_user, payload)

    overlap = BookingCreate(
        listing_id=sample_listing.id,
        check_in=future_date(11),
        check_out=future_date(14),
        guests=2,
    )
    with pytest.raises(HTTPException) as exc_info:
        create_booking(db, guest_user, overlap)
    assert exc_info.value.status_code == 409


def test_back_to_back_stays_allowed(db: Session, guest_user, sample_listing):
    from tests.conftest import future_date

    first_out = future_date(7)
    create_booking(
        db,
        guest_user,
        BookingCreate(
            listing_id=sample_listing.id,
            check_in=future_date(4),
            check_out=first_out,
            guests=1,
        ),
    )
    result = create_booking(
        db,
        guest_user,
        BookingCreate(
            listing_id=sample_listing.id,
            check_in=first_out,
            check_out=future_date(10),
            guests=1,
        ),
    )
    assert result.status == BOOKING_STATUS_CONFIRMED


def test_cancel_booking_frees_dates(db: Session, guest_user, sample_listing):
    from tests.conftest import future_date

    check_in = future_date(20)
    check_out = future_date(23)
    created = create_booking(
        db,
        guest_user,
        BookingCreate(
            listing_id=sample_listing.id,
            check_in=check_in,
            check_out=check_out,
            guests=1,
        ),
    )
    cancelled = cancel_booking(db, guest_user, created.id)
    assert cancelled.status == BOOKING_STATUS_CANCELLED

    again = create_booking(
        db,
        guest_user,
        BookingCreate(
            listing_id=sample_listing.id,
            check_in=check_in,
            check_out=check_out,
            guests=1,
        ),
    )
    assert again.status == BOOKING_STATUS_CONFIRMED
