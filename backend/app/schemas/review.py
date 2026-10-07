from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field, field_validator

DEFAULT_REVIEWS_PAGE_SIZE = 6
MAX_REVIEWS_PAGE_SIZE = 50
MIN_RATING = 1
MAX_RATING = 5
REVIEW_COMMENT_MIN_LENGTH = 10
REVIEW_COMMENT_MAX_LENGTH = 1000


class ReviewCreate(BaseModel):
    booking_id: int = Field(ge=1)
    rating: int = Field(ge=MIN_RATING, le=MAX_RATING)
    comment: str = Field(
        min_length=REVIEW_COMMENT_MIN_LENGTH, max_length=REVIEW_COMMENT_MAX_LENGTH
    )

    @field_validator("comment", mode="before")
    @classmethod
    def strip_comment(cls, value: Any) -> Any:
        return value.strip() if isinstance(value, str) else value


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


class CreatedReviewOut(ReviewOut):
    listing_id: int
    booking_id: int


class ReviewMutationResponse(BaseModel):
    data: CreatedReviewOut
    message: str
