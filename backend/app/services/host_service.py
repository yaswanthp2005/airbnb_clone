from __future__ import annotations

from datetime import date
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import ColumnElement, Select, and_, func, select
from sqlalchemy.orm import Session, selectinload

from app.models import Amenity, Booking, Listing, ListingAmenity, ListingPhoto, Review
from app.models.booking import BOOKING_STATUS_CANCELLED, BOOKING_STATUS_CONFIRMED
from app.models.listing import PROPERTY_TYPES
from app.models.user import User
from app.schemas.booking import BookingTab
from app.schemas.host import (
    HostBookingGuestOut,
    HostBookingListingOut,
    HostBookingOut,
    HostBookingsParams,
    HostListingIn,
    HostListingOptionsOut,
    HostListingOut,
    HostPageParams,
    HostStatsOut,
)
from app.schemas.listing import AmenityOut
from app.schemas.pagination import PaginatedResponse
from app.services.listing_service import get_listing_or_404

LISTING_FORBIDDEN_MESSAGE = "You can only manage your own listings"
LISTING_CREATED_MESSAGE = "Your listing is live"
LISTING_UPDATED_MESSAGE = "Your listing was updated"
LISTING_DELETED_MESSAGE = "Your listing was deleted"

LISTING_LOAD_OPTIONS = (selectinload(Listing.photos), selectinload(Listing.amenity_links))

HOST_BOOKING_ORDER = {
    BookingTab.upcoming: (Booking.check_in.asc(),),
    BookingTab.past: (Booking.check_out.desc(),),
    BookingTab.cancelled: (Booking.check_in.desc(),),
}


def _is_upcoming(today: date) -> ColumnElement[bool]:
    """Confirmed stays that haven't finished yet (including ones in progress)."""
    return and_(Booking.status == BOOKING_STATUS_CONFIRMED, Booking.check_out > today)


def _upcoming_counts(db: Session, listing_ids: list[int]) -> dict[int, int]:
    if not listing_ids:
        return {}
    rows = db.execute(
        select(Booking.listing_id, func.count())
        .where(Booking.listing_id.in_(listing_ids), _is_upcoming(date.today()))
        .group_by(Booking.listing_id)
    ).all()
    return dict(rows)


def _to_host_listing(listing: Listing, upcoming_booking_count: int) -> HostListingOut:
    return HostListingOut(
        id=listing.id,
        slug=listing.slug,
        title=listing.title,
        description=listing.description,
        property_type=listing.property_type,
        address=listing.address,
        city=listing.city,
        state=listing.state,
        country=listing.country,
        latitude=listing.latitude,
        longitude=listing.longitude,
        price_per_night=listing.price_per_night,
        cleaning_fee=listing.cleaning_fee,
        max_guests=listing.max_guests,
        bedrooms=listing.bedrooms,
        beds=listing.beds,
        bathrooms=listing.bathrooms,
        photos=[photo.url for photo in listing.photos],
        amenities=sorted(link.amenity_id for link in listing.amenity_links),
        rating_avg=float(listing.rating_avg),
        review_count=listing.review_count,
        upcoming_booking_count=upcoming_booking_count,
        created_at=listing.created_at,
    )


def _own_listing_or_raise(db: Session, user: User, listing_id: int) -> Listing:
    listing = get_listing_or_404(db, listing_id, *LISTING_LOAD_OPTIONS)
    if listing.host_id != user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail=LISTING_FORBIDDEN_MESSAGE)
    return listing


def _host_listing_out(db: Session, listing_id: int) -> HostListingOut:
    listing = db.get(Listing, listing_id, options=LISTING_LOAD_OPTIONS, populate_existing=True)
    return _to_host_listing(listing, _upcoming_counts(db, [listing_id]).get(listing_id, 0))


def _resolve_coordinates(db: Session, payload: HostListingIn) -> tuple[float, float]:
    """Without a pin, place the listing where the existing stays in that city are."""
    if payload.latitude is not None and payload.longitude is not None:
        return payload.latitude, payload.longitude
    latitude, longitude = db.execute(
        select(func.avg(Listing.latitude), func.avg(Listing.longitude)).where(
            func.lower(Listing.city) == payload.city.lower()
        )
    ).one()
    if latitude is None or longitude is None:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"We couldn't place {payload.city} on the map. Add its latitude and longitude.",
        )
    return round(float(latitude), 6), round(float(longitude), 6)


def _canonical_place(db: Session, column, value: str) -> str:
    """Reuse the existing spelling ("goa" → "Goa") so search and suggestions group them."""
    existing = db.scalar(select(column).where(func.lower(column) == value.lower()).limit(1))
    return existing or value


def _check_amenities(db: Session, amenity_ids: list[int]) -> None:
    if not amenity_ids:
        return
    known = set(db.scalars(select(Amenity.id).where(Amenity.id.in_(amenity_ids))))
    unknown = [amenity_id for amenity_id in amenity_ids if amenity_id not in known]
    if unknown:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Unknown amenities: {', '.join(map(str, unknown))}",
        )


def _apply(db: Session, listing: Listing, payload: HostListingIn) -> None:
    _check_amenities(db, payload.amenities)
    listing.latitude, listing.longitude = _resolve_coordinates(db, payload)
    listing.city = _canonical_place(db, Listing.city, payload.city)
    listing.state = _canonical_place(db, Listing.state, payload.state)
    listing.country = _canonical_place(db, Listing.country, payload.country)
    for field in (
        "title",
        "description",
        "property_type",
        "address",
        "price_per_night",
        "cleaning_fee",
        "max_guests",
        "bedrooms",
        "beds",
        "bathrooms",
    ):
        setattr(listing, field, getattr(payload, field))

    listing.photos = [
        ListingPhoto(url=url, position=position) for position, url in enumerate(payload.photos)
    ]
    # Keep surviving links instead of re-inserting rows with the same composite key.
    wanted = set(payload.amenities)
    kept = [link for link in listing.amenity_links if link.amenity_id in wanted]
    kept_ids = {link.amenity_id for link in kept}
    listing.amenity_links = kept + [
        ListingAmenity(amenity_id=amenity_id)
        for amenity_id in payload.amenities
        if amenity_id not in kept_ids
    ]


def list_host_listings(
    db: Session, user: User, params: HostPageParams
) -> PaginatedResponse[HostListingOut]:
    total = db.scalar(select(func.count()).where(Listing.host_id == user.id)) or 0
    listings = list(
        db.scalars(
            select(Listing)
            .where(Listing.host_id == user.id)
            .order_by(Listing.created_at.desc(), Listing.id.desc())
            .offset((params.page - 1) * params.page_size)
            .limit(params.page_size)
            .options(*LISTING_LOAD_OPTIONS)
        )
    )
    upcoming = _upcoming_counts(db, [listing.id for listing in listings])
    return PaginatedResponse[HostListingOut](
        items=[_to_host_listing(listing, upcoming.get(listing.id, 0)) for listing in listings],
        total=total,
        page=params.page,
        page_size=params.page_size,
        has_next=params.page * params.page_size < total,
    )


def get_host_listing(db: Session, user: User, listing_id: int) -> HostListingOut:
    listing = _own_listing_or_raise(db, user, listing_id)
    return _to_host_listing(listing, _upcoming_counts(db, [listing.id]).get(listing.id, 0))


def create_host_listing(db: Session, user: User, payload: HostListingIn) -> HostListingOut:
    listing = Listing(host_id=user.id, rating_avg=0, review_count=0)
    _apply(db, listing, payload)
    db.add(listing)
    db.commit()
    return _host_listing_out(db, listing.id)


def update_host_listing(
    db: Session, user: User, listing_id: int, payload: HostListingIn
) -> HostListingOut:
    listing = _own_listing_or_raise(db, user, listing_id)
    _apply(db, listing, payload)
    db.commit()
    return _host_listing_out(db, listing.id)


def delete_host_listing(db: Session, user: User, listing_id: int) -> int:
    listing = _own_listing_or_raise(db, user, listing_id)
    upcoming = _upcoming_counts(db, [listing.id]).get(listing.id, 0)
    if upcoming:
        reservations = "reservation" if upcoming == 1 else "reservations"
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            detail=(
                f"This listing has {upcoming} upcoming {reservations}, so it can't be deleted. "
                "It can be deleted once those stays are over or cancelled."
            ),
        )
    db.delete(listing)
    db.commit()
    return listing_id


def _filter_host_bookings(stmt: Select, tab: BookingTab, today: date) -> Select:
    if tab == BookingTab.cancelled:
        return stmt.where(Booking.status == BOOKING_STATUS_CANCELLED)
    if tab == BookingTab.upcoming:
        return stmt.where(_is_upcoming(today))
    return stmt.where(Booking.status == BOOKING_STATUS_CONFIRMED, Booking.check_out <= today)


def _to_host_booking(booking: Booking) -> HostBookingOut:
    listing = booking.listing
    return HostBookingOut(
        id=booking.id,
        listing=HostBookingListingOut(
            id=listing.id,
            slug=listing.slug,
            title=listing.title,
            city=listing.city,
            photo_url=listing.photos[0].url if listing.photos else None,
        ),
        guest=HostBookingGuestOut(
            id=booking.guest.id, name=booking.guest.name, avatar_url=booking.guest.avatar_url
        ),
        check_in=booking.check_in,
        check_out=booking.check_out,
        nights=(booking.check_out - booking.check_in).days,
        guests=booking.guests,
        total_price=booking.total_price,
        host_payout=booking.total_price - booking.service_fee,
        status=booking.status,
        created_at=booking.created_at,
    )


def list_host_bookings(
    db: Session, user: User, params: HostBookingsParams
) -> PaginatedResponse[HostBookingOut]:
    stmt = select(Booking).join(Listing, Listing.id == Booking.listing_id).where(
        Listing.host_id == user.id
    )
    if params.listing_id is not None:
        stmt = stmt.where(Booking.listing_id == params.listing_id)
    stmt = _filter_host_bookings(stmt, params.tab, date.today())

    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    bookings = db.scalars(
        stmt.order_by(*HOST_BOOKING_ORDER[params.tab], Booking.id.desc())
        .offset((params.page - 1) * params.page_size)
        .limit(params.page_size)
        .options(
            selectinload(Booking.listing).selectinload(Listing.photos),
            selectinload(Booking.guest),
        )
    )
    return PaginatedResponse[HostBookingOut](
        items=[_to_host_booking(booking) for booking in bookings],
        total=total,
        page=params.page,
        page_size=params.page_size,
        has_next=params.page * params.page_size < total,
    )


def get_host_stats(db: Session, user: User) -> HostStatsOut:
    listing_count = db.scalar(select(func.count()).where(Listing.host_id == user.id)) or 0
    host_bookings = select(Booking).join(Listing, Listing.id == Booking.listing_id).where(
        Listing.host_id == user.id
    )
    upcoming = (
        db.scalar(
            select(func.count()).select_from(
                host_bookings.where(_is_upcoming(date.today())).subquery()
            )
        )
        or 0
    )
    earnings: Optional[int] = db.scalar(
        select(func.sum(Booking.total_price - Booking.service_fee))
        .join(Listing, Listing.id == Booking.listing_id)
        .where(Listing.host_id == user.id, Booking.status == BOOKING_STATUS_CONFIRMED)
    )
    review_count, rating_avg = db.execute(
        select(func.count(Review.id), func.avg(Review.rating))
        .join(Listing, Listing.id == Review.listing_id)
        .where(Listing.host_id == user.id)
    ).one()
    return HostStatsOut(
        listing_count=listing_count,
        upcoming_reservations=upcoming,
        total_earnings=int(earnings or 0),
        rating_avg=round(float(rating_avg or 0), 2),
        review_count=review_count,
    )


def get_listing_options(db: Session) -> HostListingOptionsOut:
    amenities = db.scalars(select(Amenity).order_by(Amenity.name))
    return HostListingOptionsOut(
        property_types=list(PROPERTY_TYPES),
        amenities=[AmenityOut.model_validate(amenity) for amenity in amenities],
    )
