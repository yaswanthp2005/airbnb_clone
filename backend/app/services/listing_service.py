from __future__ import annotations

from datetime import date, timedelta
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import ColumnElement, Select, case, func, or_, select
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.orm.interfaces import ORMOption

from app.models import (
    Amenity,
    Booking,
    Listing,
    ListingAmenity,
    ListingPhoto,
    Review,
    WishlistItem,
)
from app.models.user import User
from app.schemas.listing import (
    DEFAULT_AVAILABILITY_WINDOW_DAYS,
    AmenityOut,
    ListingCardOut,
    ListingDetailOut,
    ListingFilterOptions,
    ListingFilterParams,
    ListingHostOut,
    ListingSort,
    LocationSuggestion,
    LocationSuggestionParams,
    PropertyTypeSummary,
    RatingCount,
    UnavailableDatesParams,
)
from app.schemas.pagination import PaginatedResponse
from app.services.availability import overlaps_confirmed_booking

PRICE_HISTOGRAM_BUCKETS = 40

LISTING_NOT_FOUND_MESSAGE = "Listing not found"

RATING_SCALE = (5, 4, 3, 2, 1)

LIKE_ESCAPE = "\\"

GUEST_FAVOURITE_MIN_RATING = 4.5
GUEST_FAVOURITE_MIN_REVIEWS = 5

SORT_ORDER = {
    ListingSort.recommended: (
        Listing.rating_avg.desc(),
        Listing.review_count.desc(),
    ),
    ListingSort.price_asc: (Listing.price_per_night.asc(),),
    ListingSort.price_desc: (Listing.price_per_night.desc(),),
    ListingSort.rating_desc: (Listing.rating_avg.desc(),),
    ListingSort.newest: (Listing.created_at.desc(),),
}


def _filter_by_price(
    stmt: Select, min_price: Optional[int], max_price: Optional[int]
) -> Select:
    if min_price is not None:
        stmt = stmt.where(Listing.price_per_night >= min_price)
    if max_price is not None:
        stmt = stmt.where(Listing.price_per_night <= max_price)
    return stmt


def _filter_by_property_type(stmt: Select, property_types: list[str]) -> Select:
    if not property_types:
        return stmt
    return stmt.where(Listing.property_type.in_(property_types))


def _filter_by_bedrooms(stmt: Select, bedrooms: Optional[int]) -> Select:
    if bedrooms is None:
        return stmt
    return stmt.where(Listing.bedrooms >= bedrooms)


def _filter_by_amenities(stmt: Select, amenity_ids: list[int]) -> Select:
    unique_ids = set(amenity_ids)
    if not unique_ids:
        return stmt
    # A listing must offer every selected amenity, not just one of them.
    matching_listing_ids = (
        select(ListingAmenity.listing_id)
        .where(ListingAmenity.amenity_id.in_(unique_ids))
        .group_by(ListingAmenity.listing_id)
        .having(func.count(func.distinct(ListingAmenity.amenity_id)) == len(unique_ids))
    )
    return stmt.where(Listing.id.in_(matching_listing_ids))


def _contains_ci(column: ColumnElement[str], term: str) -> ColumnElement[bool]:
    escaped = (
        term.lower()
        .replace(LIKE_ESCAPE, LIKE_ESCAPE * 2)
        .replace("%", f"{LIKE_ESCAPE}%")
        .replace("_", f"{LIKE_ESCAPE}_")
    )
    return func.lower(column).like(f"%{escaped}%", escape=LIKE_ESCAPE)


def _location_terms(location: Optional[str]) -> list[str]:
    return [term.strip() for term in (location or "").split(",") if term.strip()]


def _matches_location(term: str) -> ColumnElement[bool]:
    return or_(
        _contains_ci(Listing.city, term),
        _contains_ci(Listing.state, term),
        _contains_ci(Listing.country, term),
    )


def _filter_by_location(stmt: Select, location: Optional[str]) -> Select:
    # "Udaipur, Rajasthan" → every comma-separated part must match some field.
    for term in _location_terms(location):
        stmt = stmt.where(_matches_location(term))
    return stmt


def _filter_by_availability(
    stmt: Select, check_in: Optional[date], check_out: Optional[date]
) -> Select:
    if check_in is None or check_out is None:
        return stmt
    overlapping_booking = (
        select(Booking.id)
        .where(Booking.listing_id == Listing.id, overlaps_confirmed_booking(check_in, check_out))
        .exists()
    )
    return stmt.where(~overlapping_booking)


def _filter_by_guests(stmt: Select, guests: Optional[int]) -> Select:
    if guests is None:
        return stmt
    return stmt.where(Listing.max_guests >= guests)


def _filtered_listings(params: ListingFilterParams) -> Select:
    stmt = select(Listing)
    stmt = _filter_by_price(stmt, params.min_price, params.max_price)
    stmt = _filter_by_property_type(stmt, params.property_type)
    stmt = _filter_by_bedrooms(stmt, params.bedrooms)
    stmt = _filter_by_amenities(stmt, params.amenities)
    stmt = _filter_by_location(stmt, params.location)
    stmt = _filter_by_availability(stmt, params.check_in, params.check_out)
    stmt = _filter_by_guests(stmt, params.guests)
    return stmt


def _wishlisted_ids(
    db: Session, user: Optional[User], listing_ids: list[int]
) -> set[int]:
    if not user or not listing_ids:
        return set()
    rows = db.scalars(
        select(WishlistItem.listing_id).where(
            WishlistItem.user_id == user.id,
            WishlistItem.listing_id.in_(listing_ids),
        )
    )
    return set(rows)


def _is_guest_favourite(listing: Listing) -> bool:
    return (
        float(listing.rating_avg) >= GUEST_FAVOURITE_MIN_RATING
        and listing.review_count >= GUEST_FAVOURITE_MIN_REVIEWS
    )


def to_listing_card(listing: Listing, is_wishlisted: bool) -> ListingCardOut:
    return ListingCardOut(
        id=listing.id,
        slug=listing.slug,
        title=listing.title,
        property_type=listing.property_type,
        city=listing.city,
        state=listing.state,
        country=listing.country,
        latitude=float(listing.latitude),
        longitude=float(listing.longitude),
        price_per_night=listing.price_per_night,
        bedrooms=listing.bedrooms,
        beds=listing.beds,
        max_guests=listing.max_guests,
        rating_avg=float(listing.rating_avg),
        review_count=listing.review_count,
        is_guest_favourite=_is_guest_favourite(listing),
        photos=[photo.url for photo in listing.photos],
        is_wishlisted=is_wishlisted,
    )


def list_listings(
    db: Session, params: ListingFilterParams, user: Optional[User]
) -> PaginatedResponse[ListingCardOut]:
    filtered = _filtered_listings(params)

    total = db.scalar(select(func.count()).select_from(filtered.subquery())) or 0

    page_stmt = (
        filtered.order_by(*SORT_ORDER[params.sort], Listing.id.asc())
        .offset((params.page - 1) * params.page_size)
        .limit(params.page_size)
        .options(selectinload(Listing.photos))
    )
    listings = list(db.scalars(page_stmt))
    wishlisted = _wishlisted_ids(db, user, [listing.id for listing in listings])

    return PaginatedResponse[ListingCardOut](
        items=[to_listing_card(listing, listing.id in wishlisted) for listing in listings],
        total=total,
        page=params.page,
        page_size=params.page_size,
        has_next=params.page * params.page_size < total,
    )


def get_listing_or_404(db: Session, listing_id: int, *options: ORMOption) -> Listing:
    listing = db.get(Listing, listing_id, options=options)
    if listing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=LISTING_NOT_FOUND_MESSAGE
        )
    return listing


def get_listing_by_slug_or_404(db: Session, slug: str, *options: ORMOption) -> Listing:
    listing = db.scalar(select(Listing).where(Listing.slug == slug).options(*options))
    if listing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=LISTING_NOT_FOUND_MESSAGE
        )
    return listing


def _host_out(db: Session, host: User) -> ListingHostOut:
    listing_count, review_count, rating_avg = db.execute(
        select(
            func.count(func.distinct(Listing.id)),
            func.count(Review.id),
            func.avg(Review.rating),
        )
        .select_from(Listing)
        .outerjoin(Review, Review.listing_id == Listing.id)
        .where(Listing.host_id == host.id)
    ).one()
    return ListingHostOut(
        id=host.id,
        name=host.name,
        avatar_url=host.avatar_url,
        bio=host.bio,
        joined_at=host.created_at,
        listing_count=listing_count,
        review_count=review_count,
        rating_avg=round(float(rating_avg or 0), 2),
    )


def _rating_breakdown(db: Session, listing_id: int) -> list[RatingCount]:
    counts = dict(
        db.execute(
            select(Review.rating, func.count())
            .where(Review.listing_id == listing_id)
            .group_by(Review.rating)
        ).all()
    )
    return [RatingCount(rating=rating, count=counts.get(rating, 0)) for rating in RATING_SCALE]


def get_listing_detail(
    db: Session, listing_slug: str, user: Optional[User]
) -> ListingDetailOut:
    listing = get_listing_by_slug_or_404(
        db,
        listing_slug,
        selectinload(Listing.photos),
        selectinload(Listing.amenity_links).selectinload(ListingAmenity.amenity),
        selectinload(Listing.host),
    )
    amenities = sorted(
        (link.amenity for link in listing.amenity_links), key=lambda amenity: amenity.name
    )
    return ListingDetailOut(
        id=listing.id,
        slug=listing.slug,
        title=listing.title,
        description=listing.description,
        property_type=listing.property_type,
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
        rating_avg=float(listing.rating_avg),
        review_count=listing.review_count,
        rating_breakdown=_rating_breakdown(db, listing.id),
        photos=[photo.url for photo in listing.photos],
        amenities=[AmenityOut.model_validate(amenity) for amenity in amenities],
        host=_host_out(db, listing.host),
        is_wishlisted=listing.id in _wishlisted_ids(db, user, [listing.id]),
    )


def get_unavailable_dates(
    db: Session, listing_slug: str, params: UnavailableDatesParams
) -> list[date]:
    """Booked nights: a stay from check_in to check_out occupies every night before check_out."""
    listing = get_listing_by_slug_or_404(db, listing_slug)
    listing_id = listing.id
    start = params.start_date or date.today()
    end = params.end_date or start + timedelta(days=DEFAULT_AVAILABILITY_WINDOW_DAYS)

    bookings = db.execute(
        select(Booking.check_in, Booking.check_out).where(
            Booking.listing_id == listing_id, overlaps_confirmed_booking(start, end)
        )
    )
    nights: set[date] = set()
    for check_in, check_out in bookings:
        night, last = max(check_in, start), min(check_out, end)
        while night < last:
            nights.add(night)
            night += timedelta(days=1)
    return sorted(nights)


def _price_histogram(prices: list[int], min_price: int, max_price: int) -> list[int]:
    buckets = [0] * PRICE_HISTOGRAM_BUCKETS
    if not prices:
        return buckets
    span = max(max_price - min_price, 1)
    for price in prices:
        index = int((price - min_price) / span * PRICE_HISTOGRAM_BUCKETS)
        buckets[min(index, PRICE_HISTOGRAM_BUCKETS - 1)] += 1
    return buckets


def get_filter_options(db: Session) -> ListingFilterOptions:
    prices = list(db.scalars(select(Listing.price_per_night)))
    min_price = min(prices, default=0)
    max_price = max(prices, default=0)

    property_types = list(
        db.scalars(
            select(Listing.property_type).distinct().order_by(Listing.property_type)
        )
    )
    amenities = db.scalars(select(Amenity).order_by(Amenity.name))

    return ListingFilterOptions(
        min_price=min_price,
        max_price=max_price,
        price_histogram=_price_histogram(prices, min_price, max_price),
        property_types=property_types,
        amenities=[AmenityOut.model_validate(amenity) for amenity in amenities],
    )


def list_search_amenities(db: Session, params: ListingFilterParams) -> list[AmenityOut]:
    """Amenities offered by at least one listing in the search, most common first.

    The amenity filter itself is ignored, so picking one amenity doesn't hide the others.
    """
    matching_ids = (
        _filtered_listings(params.model_copy(update={"amenities": []}))
        .with_only_columns(Listing.id)
    )
    listing_count = func.count(ListingAmenity.listing_id)
    amenities = db.scalars(
        select(Amenity)
        .join(ListingAmenity, ListingAmenity.amenity_id == Amenity.id)
        .where(ListingAmenity.listing_id.in_(matching_ids))
        .group_by(Amenity.id)
        .order_by(listing_count.desc(), Amenity.name.asc())
    )
    return [AmenityOut.model_validate(amenity) for amenity in amenities]


def list_property_types(db: Session) -> list[PropertyTypeSummary]:
    """Each property type with its listing count; the cover is its top-recommended listing's first photo."""
    counts: dict[str, int] = {}
    cover_listing_ids: dict[str, int] = {}
    rows = db.execute(
        select(Listing.id, Listing.property_type).order_by(
            *SORT_ORDER[ListingSort.recommended], Listing.id.asc()
        )
    )
    for listing_id, property_type in rows:
        counts[property_type] = counts.get(property_type, 0) + 1
        cover_listing_ids.setdefault(property_type, listing_id)

    covers: dict[int, str] = {}
    photos = db.execute(
        select(ListingPhoto.listing_id, ListingPhoto.url)
        .where(ListingPhoto.listing_id.in_(cover_listing_ids.values()))
        .order_by(ListingPhoto.position.asc(), ListingPhoto.id.asc())
    )
    for listing_id, url in photos:
        covers.setdefault(listing_id, url)

    return [
        PropertyTypeSummary(
            property_type=property_type,
            listing_count=count,
            cover_photo=covers.get(cover_listing_ids[property_type]),
        )
        for property_type, count in sorted(counts.items(), key=lambda item: (-item[1], item[0]))
    ]


def suggest_locations(
    db: Session, params: LocationSuggestionParams
) -> list[LocationSuggestion]:
    listing_count = func.count(Listing.id)
    stmt = select(
        Listing.city, Listing.state, Listing.country, listing_count
    ).group_by(Listing.city, Listing.state, Listing.country)

    ordering: list[ColumnElement] = []
    for term in _location_terms(params.q):
        stmt = stmt.where(_matches_location(term))
    if params.q:
        city_prefix = params.q.split(",")[0].strip().lower()
        ordering.append(
            case((func.lower(Listing.city).startswith(city_prefix), 0), else_=1)
        )

    rows = db.execute(
        stmt.order_by(*ordering, listing_count.desc(), Listing.city.asc()).limit(
            params.limit
        )
    )
    return [
        LocationSuggestion(city=city, state=state, country=country, listing_count=count)
        for city, state, country, count in rows
    ]
