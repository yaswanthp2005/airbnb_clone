from __future__ import annotations

from pydantic import BaseModel, Field

DEFAULT_WISHLIST_PAGE_SIZE = 20
MAX_WISHLIST_PAGE_SIZE = 50


class WishlistParams(BaseModel):
    page: int = Field(default=1, ge=1)
    page_size: int = Field(
        default=DEFAULT_WISHLIST_PAGE_SIZE, ge=1, le=MAX_WISHLIST_PAGE_SIZE
    )


class WishlistStatusOut(BaseModel):
    listing_id: int
    is_wishlisted: bool


class WishlistMutationResponse(BaseModel):
    data: WishlistStatusOut
    message: str
