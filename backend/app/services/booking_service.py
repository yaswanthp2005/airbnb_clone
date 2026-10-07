from __future__ import annotations

from datetime import date

from fastapi import HTTPException, status
from sqlalchemy import Select, func, select
from sqlalchemy.orm import Session, selectinload

from app.models import Booking, Listing
from app.models.booking import BOOKING_STATUS_CANCELLED, BOOKING_STATUS_CONFIRMED
from app.models.user import User
from app.schemas.booking import (
    BookingCreate,
    BookingListingOut,
    BookingOut,
    BookingReviewOut,
    BookingTab,
    MyBookingsParams,
)
from app.schemas.pagination import PaginatedResponse
from app.services.availability import overlaps_confirmed_booking
from app.services.listing_service import LISTING_NOT_FOUND_MESSAGE
from app.services.pricing import quote_stay
from app.services.transactions import begin_write

BOOKING_NOT_FOUND_MESSAGE = "Booking not found"
BOOKING_FORBIDDEN_MESSAGE = "You can only manage your own bookings"
DATES_UNAVAILABLE_MESSAGE = (
    "Those dates are no longer available. Please choose different dates."
)
OWN_LISTING_MESSAGE = "You can't book your own listing"
ALREADY_CANCELLED_MESSAGE = "This booking is already cancelled"
NOT_CANCELLABLE_MESSAGE = "Trips that have already started can't be cancelled"

BOOKING_LOAD_OPTIONS = (
    selectinload(Booking.listing).selectinload(Listing.photos),
    selectinload(Booking.listing).selectinload(Listing.host),
    selectinload(Booking.review),
)

TAB_ORDER = {
    BookingTab.upcoming: (Booking.check_in.asc(),),
    BookingTab.past: (Booking.check_out.desc(),),
    BookingTab.cancelled: (Booking.check_in.desc(),),
}


def _can_cancel(booking: Booking, today: date) -> bool:
    return booking.status == BOOKING_STATUS_CONFIRMED and booking.check_in >= today


def is_stay_over(booking: Booking, today: date) -> bool:
    """Checkout day counts as over, matching the "past" trips tab."""
    return booking.status == BOOKING_STATUS_CONFIRMED and booking.check_out <= today


def _to_booking_out(booking: Booking, today: date) -> BookingOut:
    listing = booking.listing
    return BookingOut(
        id=booking.id,
        listing=BookingListingOut(
            id=listing.id,
            slug=listing.slug,
            title=listing.title,
            property_type=listing.property_type,
            city=listing.city,
            state=listing.state,
            country=listing.country,
            photo_url=listing.photos[0].url if listing.photos else None,
            host_name=listing.host.name,
        ),
        check_in=booking.check_in,
        check_out=booking.check_out,
        nights=(booking.check_out - booking.check_in).days,
        guests=booking.guests,
        nightly_price=booking.nightly_price,
        cleaning_fee=booking.cleaning_fee,
        service_fee=booking.service_fee,
        total_price=booking.total_price,
        status=booking.status,
        can_cancel=_can_cancel(booking, today),
        can_review=booking.review is None and is_stay_over(booking, today),
        review=(
            BookingReviewOut(id=booking.review.id, rating=booking.review.rating)
            if booking.review
            else None
        ),
        created_at=booking.created_at,
    )


def _load_booking_out(db: Session, booking_id: int) -> BookingOut:
    booking = db.get(Booking, booking_id, options=BOOKING_LOAD_OPTIONS, populate_existing=True)
    return _to_booking_out(booking, date.today())


def _lock_listing_for_booking(db: Session, listing_id: int) -> Listing:
    """Serialises bookings so the overlap check and the insert can't interleave with another request."""
    begin_write(db)
    listing = db.scalar(select(Listing).where(Listing.id == listing_id).with_for_update())
    if listing is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=LISTING_NOT_FOUND_MESSAGE)
    return listing


def create_booking(db: Session, guest: User, payload: BookingCreate) -> BookingOut:
    try:
        listing = _lock_listing_for_booking(db, payload.listing_id)
        if listing.host_id == guest.id:
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_ENTITY, detail=OWN_LISTING_MESSAGE
            )
        if payload.guests > listing.max_guests:
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"This place allows up to {listing.max_guests} guests",
            )

        has_conflict = db.scalar(
            select(
                select(Booking.id)
                .where(
                    Booking.listing_id == listing.id,
                    overlaps_confirmed_booking(payload.check_in, payload.check_out),
                )
                .exists()
            )
        )
        if has_conflict:
            raise HTTPException(status.HTTP_409_CONFLICT, detail=DATES_UNAVAILABLE_MESSAGE)

        quote = quote_stay(
            listing.price_per_night,
            listing.cleaning_fee,
            (payload.check_out - payload.check_in).days,
        )
        booking = Booking(
            listing_id=listing.id,
            guest_id=guest.id,
            check_in=payload.check_in,
            check_out=payload.check_out,
            guests=payload.guests,
            nightly_price=quote.nightly_price,
            cleaning_fee=quote.cleaning_fee,
            service_fee=quote.service_fee,
            total_price=quote.total,
            status=BOOKING_STATUS_CONFIRMED,
        )
        db.add(booking)
        db.commit()
    except Exception:
        db.rollback()
        raise

    return _load_booking_out(db, booking.id)


def _get_own_booking(db: Session, user: User, booking_id: int) -> Booking:
    booking = db.get(Booking, booking_id, options=BOOKING_LOAD_OPTIONS)
    if booking is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=BOOKING_NOT_FOUND_MESSAGE)
    if booking.guest_id != user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail=BOOKING_FORBIDDEN_MESSAGE)
    return booking


def get_booking(db: Session, user: User, booking_id: int) -> BookingOut:
    return _to_booking_out(_get_own_booking(db, user, booking_id), date.today())


def _filter_by_tab(stmt: Select, tab: BookingTab, today: date) -> Select:
    if tab == BookingTab.cancelled:
        return stmt.where(Booking.status == BOOKING_STATUS_CANCELLED)
    stmt = stmt.where(Booking.status == BOOKING_STATUS_CONFIRMED)
    if tab == BookingTab.upcoming:
        return stmt.where(Booking.check_out > today)
    return stmt.where(Booking.check_out <= today)


def list_my_bookings(
    db: Session, user: User, params: MyBookingsParams
) -> PaginatedResponse[BookingOut]:
    today = date.today()
    filtered = _filter_by_tab(select(Booking).where(Booking.guest_id == user.id), params.tab, today)

    total = db.scalar(select(func.count()).select_from(filtered.subquery())) or 0
    bookings = db.scalars(
        filtered.order_by(*TAB_ORDER[params.tab], Booking.id.desc())
        .offset((params.page - 1) * params.page_size)
        .limit(params.page_size)
        .options(*BOOKING_LOAD_OPTIONS)
    )

    return PaginatedResponse[BookingOut](
        items=[_to_booking_out(booking, today) for booking in bookings],
        total=total,
        page=params.page,
        page_size=params.page_size,
        has_next=params.page * params.page_size < total,
    )


def cancel_booking(db: Session, user: User, booking_id: int) -> BookingOut:
    booking = _get_own_booking(db, user, booking_id)
    if booking.status == BOOKING_STATUS_CANCELLED:
        raise HTTPException(status.HTTP_409_CONFLICT, detail=ALREADY_CANCELLED_MESSAGE)
    if not _can_cancel(booking, date.today()):
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY, detail=NOT_CANCELLABLE_MESSAGE
        )

    booking.status = BOOKING_STATUS_CANCELLED
    db.commit()
    return _load_booking_out(db, booking.id)
