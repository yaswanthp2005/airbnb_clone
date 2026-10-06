from __future__ import annotations

from typing import Optional

from sqlalchemy import Select, false, func, select
from sqlalchemy.orm import Session, selectinload

from app.models import Amenity, Listing, ListingAmenity, WishlistItem
from app.models.user import User
from app.schemas.listing import (
    AmenityOut,
    ListingCardOut,
    ListingFilterOptions,
    ListingFilterParams,
    ListingSort,
)
from app.schemas.pagination import PaginatedResponse

PRICE_HISTOGRAM_BUCKETS = 40

DEFAULT_CATEGORY = "trending"

# Frontend category keys → seeded property types. Unmapped keys match nothing.
CATEGORY_PROPERTY_TYPES: dict[str, tuple[str, ...]] = {
    "beachfront": ("Beachfront",),
    "cabins": ("Cabin",),
    "villas": ("Villa",),
    "treehouses": ("Treehouse",),
    "farms": ("Farmhouse",),
    "rooms": ("Apartment",),
    "camping": ("Camping",),
    "lake": ("Houseboat",),
    "houseboats": ("Houseboat",),
    "heritage": ("Heritage haveli",),
    "mansions": ("Villa", "Heritage haveli"),
    "countryside": ("Farmhouse", "Cabin"),
    "tropical": ("Beachfront", "Villa"),
    "islands": ("Beachfront",),
    "desert": ("Heritage haveli", "Camping"),
}

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


def _filter_by_category(stmt: Select, category: Optional[str]) -> Select:
    if not category or category == DEFAULT_CATEGORY:
        return stmt
    property_types = CATEGORY_PROPERTY_TYPES.get(category)
    if not property_types:
        return stmt.where(false())
    return stmt.where(Listing.property_type.in_(property_types))


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


def _filtered_listings(params: ListingFilterParams) -> Select:
    stmt = select(Listing)
    stmt = _filter_by_category(stmt, params.category)
    stmt = _filter_by_price(stmt, params.min_price, params.max_price)
    stmt = _filter_by_property_type(stmt, params.property_type)
    stmt = _filter_by_bedrooms(stmt, params.bedrooms)
    stmt = _filter_by_amenities(stmt, params.amenities)
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


def _to_card(listing: Listing, is_wishlisted: bool) -> ListingCardOut:
    return ListingCardOut(
        id=listing.id,
        title=listing.title,
        property_type=listing.property_type,
        city=listing.city,
        state=listing.state,
        country=listing.country,
        price_per_night=listing.price_per_night,
        bedrooms=listing.bedrooms,
        beds=listing.beds,
        max_guests=listing.max_guests,
        rating_avg=float(listing.rating_avg),
        review_count=listing.review_count,
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
        items=[_to_card(listing, listing.id in wishlisted) for listing in listings],
        total=total,
        page=params.page,
        page_size=params.page_size,
        has_next=params.page * params.page_size < total,
    )


def _price_histogram(prices: list[int], min_price: int, max_price: int) -> list[int]:
    buckets = [0] * PRICE_HISTOGRAM_BUCKETS
    if not prices:
        return buckets
    span = max(max_price - min_price, 1)
    for price in prices:
        index = int((price - min_price) / span * PRICE_HISTOGRAM_BUCKETS)
        buckets[min(index, PRICE_HISTOGRAM_BUCKETS - 1)] += 1
    return buckets


def get_filter_options(db: Session, category: Optional[str]) -> ListingFilterOptions:
    overall_min, overall_max = db.execute(
        select(func.min(Listing.price_per_night), func.max(Listing.price_per_night))
    ).one()
    min_price = overall_min or 0
    max_price = overall_max or 0

    category_prices = list(
        db.scalars(
            _filter_by_category(select(Listing.price_per_night), category)
        )
    )
    property_types = list(
        db.scalars(
            select(Listing.property_type).distinct().order_by(Listing.property_type)
        )
    )
    amenities = db.scalars(select(Amenity).order_by(Amenity.name))

    return ListingFilterOptions(
        min_price=min_price,
        max_price=max_price,
        price_histogram=_price_histogram(category_prices, min_price, max_price),
        property_types=property_types,
        amenities=[AmenityOut.model_validate(amenity) for amenity in amenities],
    )
