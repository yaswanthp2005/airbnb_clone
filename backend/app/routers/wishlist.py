from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db_session
from app.models.user import User
from app.schemas.listing import ListingCardOut
from app.schemas.pagination import PaginatedResponse
from app.schemas.wishlist import WishlistMutationResponse, WishlistParams
from app.services.wishlist_service import (
    add_to_wishlist,
    list_wishlist,
    remove_from_wishlist,
)

router = APIRouter(prefix="/wishlist", tags=["wishlist"])

ListingId = Annotated[int, Path(ge=1)]


@router.get("", response_model=PaginatedResponse[ListingCardOut])
def index(
    params: Annotated[WishlistParams, Query()],
    db: Session = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> PaginatedResponse[ListingCardOut]:
    return list_wishlist(db, user, params)


@router.post("/{listing_id}", response_model=WishlistMutationResponse)
def add(
    listing_id: ListingId,
    db: Session = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> WishlistMutationResponse:
    return WishlistMutationResponse(
        data=add_to_wishlist(db, user, listing_id), message="Saved to your wishlist"
    )


@router.delete("/{listing_id}", response_model=WishlistMutationResponse)
def remove(
    listing_id: ListingId,
    db: Session = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> WishlistMutationResponse:
    return WishlistMutationResponse(
        data=remove_from_wishlist(db, user, listing_id), message="Removed from your wishlist"
    )
