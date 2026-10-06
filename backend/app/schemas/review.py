from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

DEFAULT_REVIEWS_PAGE_SIZE = 6
MAX_REVIEWS_PAGE_SIZE = 50


class ReviewListParams(BaseModel):
    page: int = Field(default=1, ge=1)
    page_size: int = Field(
        default=DEFAULT_REVIEWS_PAGE_SIZE, ge=1, le=MAX_REVIEWS_PAGE_SIZE
    )


class ReviewerOut(BaseModel):
    id: int
    name: str
    avatar_url: Optional[str] = None
    joined_at: datetime


class ReviewOut(BaseModel):
    id: int
    rating: int
    comment: str
    created_at: datetime
    guest: ReviewerOut
