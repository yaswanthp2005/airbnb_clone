from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.models import Review
from app.schemas.pagination import PaginatedResponse
from app.schemas.review import ReviewerOut, ReviewListParams, ReviewOut
from app.services.listing_service import get_listing_or_404


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
