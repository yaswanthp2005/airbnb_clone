from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db_session
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewMutationResponse
from app.services.review_service import create_review

router = APIRouter(prefix="/reviews", tags=["reviews"])

@router.post("", response_model=ReviewMutationResponse, status_code=status.HTTP_201_CREATED)
def create(
    payload: ReviewCreate,
    db: Session = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> ReviewMutationResponse:
    return ReviewMutationResponse(
        data=create_review(db, user, payload), message="Thanks for sharing your review"
    )
