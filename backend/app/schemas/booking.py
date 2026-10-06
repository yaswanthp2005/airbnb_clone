from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from typing import Literal, Optional

from pydantic import BaseModel, Field, model_validator

from app.schemas.listing import MAX_GUESTS

MAX_STAY_NIGHTS = 365
DEFAULT_BOOKINGS_PAGE_SIZE = 12
MAX_BOOKINGS_PAGE_SIZE = 50

BookingStatus = Literal["confirmed", "cancelled"]


class BookingCreate(BaseModel):
    """Prices are deliberately absent: the server always computes them."""

    listing_id: int = Field(ge=1)
    check_in: date
    check_out: date
    guests: int = Field(ge=1, le=MAX_GUESTS)

    @model_validator(mode="after")
    def check_dates(self) -> "BookingCreate":
        if self.check_out <= self.check_in:
            raise ValueError("Checkout must be after check-in")
        if self.check_in < date.today():
            raise ValueError("Check-in can't be in the past")
        if (self.check_out - self.check_in).days > MAX_STAY_NIGHTS:
            raise ValueError(f"Stays can't be longer than {MAX_STAY_NIGHTS} nights")
        return self


class BookingTab(str, Enum):
    upcoming = "upcoming"
    past = "past"
    cancelled = "cancelled"


class MyBookingsParams(BaseModel):
    tab: BookingTab = BookingTab.upcoming
    page: int = Field(default=1, ge=1)
    page_size: int = Field(
        default=DEFAULT_BOOKINGS_PAGE_SIZE, ge=1, le=MAX_BOOKINGS_PAGE_SIZE
    )


class BookingListingOut(BaseModel):
    id: int
    title: str
    property_type: str
    city: str
    state: str
    country: str
    photo_url: Optional[str] = None
    host_name: str


class BookingOut(BaseModel):
    id: int
    listing: BookingListingOut
    check_in: date
    check_out: date
    nights: int
    guests: int
    nightly_price: int
    cleaning_fee: int
    service_fee: int
    total_price: int
    status: BookingStatus
    can_cancel: bool
    created_at: datetime


class BookingResponse(BaseModel):
    data: BookingOut


class BookingMutationResponse(BaseModel):
    data: BookingOut
    message: str
