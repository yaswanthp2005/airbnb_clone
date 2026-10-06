from __future__ import annotations

from sqlalchemy import delete, func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.models import Listing, WishlistItem
from app.models.user import User
from app.schemas.listing import ListingCardOut
from app.schemas.pagination import PaginatedResponse
from app.schemas.wishlist import WishlistParams, WishlistStatusOut
from app.services.listing_service import get_listing_or_404, to_listing_card


def list_wishlist(
    db: Session, user: User, params: WishlistParams
) -> PaginatedResponse[ListingCardOut]:
    """Most recently saved first."""
    total = (
        db.scalar(
            select(func.count()).select_from(WishlistItem).where(WishlistItem.user_id == user.id)
        )
        or 0
    )
    listings = db.scalars(
        select(Listing)
        .join(WishlistItem, WishlistItem.listing_id == Listing.id)
        .where(WishlistItem.user_id == user.id)
        .order_by(WishlistItem.created_at.desc(), Listing.id.desc())
        .offset((params.page - 1) * params.page_size)
        .limit(params.page_size)
        .options(selectinload(Listing.photos))
    )

    return PaginatedResponse[ListingCardOut](
        items=[to_listing_card(listing, is_wishlisted=True) for listing in listings],
        total=total,
        page=params.page,
        page_size=params.page_size,
        has_next=params.page * params.page_size < total,
    )


def add_to_wishlist(db: Session, user: User, listing_id: int) -> WishlistStatusOut:
    """Idempotent, so repeated or racing saves from optimistic UIs all succeed."""
    get_listing_or_404(db, listing_id)
    if db.get(WishlistItem, (user.id, listing_id)) is None:
        db.add(WishlistItem(user_id=user.id, listing_id=listing_id))
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
    return WishlistStatusOut(listing_id=listing_id, is_wishlisted=True)


def remove_from_wishlist(db: Session, user: User, listing_id: int) -> WishlistStatusOut:
    """Idempotent: removing a listing that isn't saved still succeeds."""
    get_listing_or_404(db, listing_id)
    db.execute(
        delete(WishlistItem).where(
            WishlistItem.user_id == user.id, WishlistItem.listing_id == listing_id
        )
    )
    db.commit()
    return WishlistStatusOut(listing_id=listing_id, is_wishlisted=False)
