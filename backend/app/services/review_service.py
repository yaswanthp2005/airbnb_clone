from __future__ import annotations

from datetime import date
from decimal import ROUND_HALF_UP, Decimal

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.models import Booking, Listing, Review
from app.models.booking import BOOKING_STATUS_CANCELLED
from app.models.user import User
from app.schemas.pagination import PaginatedResponse
from app.schemas.review import (
    CreatedReviewOut,
    ReviewCreate,
    ReviewerOut,
    ReviewListParams,
    ReviewOut,
)
from app.services.booking_service import BOOKING_NOT_FOUND_MESSAGE, is_stay_over
from app.services.listing_service import get_listing_or_404
from app.services.transactions import begin_write

REVIEW_FORBIDDEN_MESSAGE = "You can only review stays you booked"
REVIEW_CANCELLED_MESSAGE = "Cancelled reservations can't be reviewed"
REVIEW_TOO_EARLY_MESSAGE = "You can leave a review once your stay is over"
REVIEW_EXISTS_MESSAGE = "You've already reviewed this stay"
RATING_PRECISION = Decimal("0.01")


def _to_review_out(review: Review) -> ReviewOut:
    return ReviewOut(
        id=review.id,
        rating=review.rating,
        comment=review.comment,
        created_at=review.created_at,
        guest=ReviewerOut(
            id=review.guest.id,
            name=review.guest.name,
            avatar_url=review.guest.avatar_url,
            joined_at=review.guest.created_at,
        ),
    )


def list_listing_reviews(
    db: Session, listing_id: int, params: ReviewListParams
) -> PaginatedResponse[ReviewOut]:
    get_listing_or_404(db, listing_id)
    reviews_stmt = select(Review).where(Review.listing_id == listing_id)

    total = db.scalar(select(func.count()).select_from(reviews_stmt.subquery())) or 0
    reviews = db.scalars(
        reviews_stmt.order_by(Review.created_at.desc(), Review.id.desc())
        .offset((params.page - 1) * params.page_size)
        .limit(params.page_size)
        .options(selectinload(Review.guest))
    )

    return PaginatedResponse[ReviewOut](
        items=[_to_review_out(review) for review in reviews],
        total=total,
        page=params.page,
        page_size=params.page_size,
        has_next=params.page * params.page_size < total,
    )


def refresh_listing_rating(db: Session, listing: Listing) -> None:
    """Recomputes from the reviews table so the stored figures can never drift."""
    review_count, rating_avg = db.execute(
        select(func.count(Review.id), func.avg(Review.rating)).where(
            Review.listing_id == listing.id
        )
    ).one()
    listing.review_count = review_count
    listing.rating_avg = Decimal(str(rating_avg or 0)).quantize(
        RATING_PRECISION, rounding=ROUND_HALF_UP
    )


def _reviewable_booking_or_raise(db: Session, user: User, booking_id: int) -> Booking:
    booking = db.get(Booking, booking_id)
    if booking is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail=BOOKING_NOT_FOUND_MESSAGE)
    if booking.guest_id != user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, detail=REVIEW_FORBIDDEN_MESSAGE)
    if booking.status == BOOKING_STATUS_CANCELLED:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY, detail=REVIEW_CANCELLED_MESSAGE
        )
    if not is_stay_over(booking, date.today()):
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY, detail=REVIEW_TOO_EARLY_MESSAGE
        )
    has_review = db.scalar(select(select(Review.id).where(Review.booking_id == booking.id).exists()))
    if has_review:
        raise HTTPException(status.HTTP_409_CONFLICT, detail=REVIEW_EXISTS_MESSAGE)
    return booking


def create_review(db: Session, user: User, payload: ReviewCreate) -> CreatedReviewOut:
    """Insert and rating refresh share one locked transaction, so concurrent reviews can't lose an update."""
    try:
        begin_write(db)
        booking = _reviewable_booking_or_raise(db, user, payload.booking_id)
        listing = db.scalar(
            select(Listing).where(Listing.id == booking.listing_id).with_for_update()
        )
        review = Review(
            listing_id=booking.listing_id,
            booking_id=booking.id,
            guest_id=user.id,
            rating=payload.rating,
            comment=payload.comment,
        )
        db.add(review)
        db.flush()
        refresh_listing_rating(db, listing)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, detail=REVIEW_EXISTS_MESSAGE)
    except Exception:
        db.rollback()
        raise

    db.refresh(review)
    return CreatedReviewOut(
        **_to_review_out(review).model_dump(),
        listing_id=review.listing_id,
        booking_id=review.booking_id,
    )
