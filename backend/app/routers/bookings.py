from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db_session
from app.models.user import User
from app.schemas.booking import (
    BookingCreate,
    BookingMutationResponse,
    BookingOut,
    BookingResponse,
    MyBookingsParams,
)
from app.schemas.pagination import PaginatedResponse
from app.services.booking_service import (
    cancel_booking,
    create_booking,
    get_booking,
    list_my_bookings,
)

router = APIRouter(prefix="/bookings", tags=["bookings"])

BookingId = Annotated[int, Path(ge=1)]


@router.post("", response_model=BookingMutationResponse, status_code=status.HTTP_201_CREATED)
def create(
    payload: BookingCreate,
    db: Session = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> BookingMutationResponse:
    return BookingMutationResponse(
        data=create_booking(db, user, payload), message="Your reservation is confirmed"
    )


@router.get("/me", response_model=PaginatedResponse[BookingOut])
def my_bookings(
    params: Annotated[MyBookingsParams, Query()],
    db: Session = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> PaginatedResponse[BookingOut]:
    return list_my_bookings(db, user, params)


@router.get("/{booking_id}", response_model=BookingResponse)
def show(
    booking_id: BookingId,
    db: Session = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> BookingResponse:
    return BookingResponse(data=get_booking(db, user, booking_id))


@router.patch("/{booking_id}/cancel", response_model=BookingMutationResponse)
def cancel(
    booking_id: BookingId,
    db: Session = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> BookingMutationResponse:
    return BookingMutationResponse(
        data=cancel_booking(db, user, booking_id), message="Your reservation was cancelled"
    )
