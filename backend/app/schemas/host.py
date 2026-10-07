from __future__ import annotations

from datetime import date, datetime
from typing import Any, Optional
from urllib.parse import urlparse

from pydantic import BaseModel, Field, field_validator, model_validator

from app.models.listing import PROPERTY_TYPES
from app.schemas.booking import BookingStatus, BookingTab
from app.schemas.listing import AmenityOut

TITLE_MIN_LENGTH = 5
TITLE_MAX_LENGTH = 100
DESCRIPTION_MIN_LENGTH = 20
DESCRIPTION_MAX_LENGTH = 5000
PLACE_MIN_LENGTH = 2
PLACE_MAX_LENGTH = 80
ADDRESS_MIN_LENGTH = 3
ADDRESS_MAX_LENGTH = 255
MIN_PRICE_PER_NIGHT = 500
MAX_PRICE_PER_NIGHT = 1_000_000
MAX_CLEANING_FEE = 100_000
MAX_LISTING_GUESTS = 16
MAX_ROOMS = 50
MIN_PHOTOS = 1
MAX_PHOTOS = 20
MAX_PHOTO_URL_LENGTH = 512
MAX_AMENITIES = 50
DEFAULT_HOST_PAGE_SIZE = 12
MAX_HOST_PAGE_SIZE = 50
PHOTO_URL_SCHEMES = ("http", "https")


def _strip(value: Any) -> Any:
    return value.strip() if isinstance(value, str) else value


class HostListingIn(BaseModel):
    """Create / full replace (PUT). Coordinates are optional; the service can place the city."""

    title: str = Field(min_length=TITLE_MIN_LENGTH, max_length=TITLE_MAX_LENGTH)
    description: str = Field(min_length=DESCRIPTION_MIN_LENGTH, max_length=DESCRIPTION_MAX_LENGTH)
    property_type: str
    address: str = Field(min_length=ADDRESS_MIN_LENGTH, max_length=ADDRESS_MAX_LENGTH)
    city: str = Field(min_length=PLACE_MIN_LENGTH, max_length=PLACE_MAX_LENGTH)
    state: str = Field(min_length=PLACE_MIN_LENGTH, max_length=PLACE_MAX_LENGTH)
    country: str = Field(default="India", min_length=PLACE_MIN_LENGTH, max_length=PLACE_MAX_LENGTH)
    latitude: Optional[float] = Field(default=None, ge=-90, le=90)
    longitude: Optional[float] = Field(default=None, ge=-180, le=180)
    price_per_night: int = Field(ge=MIN_PRICE_PER_NIGHT, le=MAX_PRICE_PER_NIGHT)
    cleaning_fee: int = Field(default=0, ge=0, le=MAX_CLEANING_FEE)
    max_guests: int = Field(ge=1, le=MAX_LISTING_GUESTS)
    bedrooms: int = Field(ge=0, le=MAX_ROOMS)
    beds: int = Field(ge=1, le=MAX_ROOMS)
    bathrooms: int = Field(ge=1, le=MAX_ROOMS)
    photos: list[str] = Field(min_length=MIN_PHOTOS, max_length=MAX_PHOTOS)
    amenities: list[int] = Field(default_factory=list, max_length=MAX_AMENITIES)

    @field_validator("title", "description", "address", "city", "state", "country", mode="before")
    @classmethod
    def strip_text(cls, value: Any) -> Any:
        return _strip(value)

    @field_validator("property_type")
    @classmethod
    def check_property_type(cls, value: str) -> str:
        if value not in PROPERTY_TYPES:
            raise ValueError(f"Property type must be one of: {', '.join(PROPERTY_TYPES)}")
        return value

    @field_validator("photos")
    @classmethod
    def check_photos(cls, value: list[str]) -> list[str]:
        urls = [url.strip() for url in value]
        for url in urls:
            parsed = urlparse(url)
            if (
                parsed.scheme not in PHOTO_URL_SCHEMES
                or not parsed.netloc
                or len(url) > MAX_PHOTO_URL_LENGTH
            ):
                raise ValueError("Each photo must be a valid http(s) URL")
        if len(set(urls)) != len(urls):
            raise ValueError("Each photo can only be added once")
        return urls

    @field_validator("amenities")
    @classmethod
    def dedupe_amenities(cls, value: list[int]) -> list[int]:
        return list(dict.fromkeys(value))

    @model_validator(mode="after")
    def check_coordinates(self) -> "HostListingIn":
        if (self.latitude is None) != (self.longitude is None):
            raise ValueError("Latitude and longitude must be provided together")
        return self


class HostListingOut(BaseModel):
    id: int
    slug: str
    title: str
    description: str
    property_type: str
    address: str
    city: str
    state: str
    country: str
    latitude: float
    longitude: float
    price_per_night: int
    cleaning_fee: int
    max_guests: int
    bedrooms: int
    beds: int
    bathrooms: int
    photos: list[str]
    amenities: list[int]
    rating_avg: float
    review_count: int
    upcoming_booking_count: int
    created_at: datetime


class HostListingResponse(BaseModel):
    data: HostListingOut


class HostListingMutationResponse(BaseModel):
    data: HostListingOut
    message: str


class HostListingDeleteOut(BaseModel):
    id: int


class HostListingDeleteResponse(BaseModel):
    data: HostListingDeleteOut
    message: str


class HostPageParams(BaseModel):
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=DEFAULT_HOST_PAGE_SIZE, ge=1, le=MAX_HOST_PAGE_SIZE)


class HostBookingsParams(HostPageParams):
    tab: BookingTab = BookingTab.upcoming
    listing_id: Optional[int] = Field(default=None, ge=1)


class HostBookingListingOut(BaseModel):
    id: int
    slug: str
    title: str
    city: str
    photo_url: Optional[str] = None


class HostBookingGuestOut(BaseModel):
    id: int
    name: str
    avatar_url: Optional[str] = None


class HostBookingOut(BaseModel):
    id: int
    listing: HostBookingListingOut
    guest: HostBookingGuestOut
    check_in: date
    check_out: date
    nights: int
    guests: int
    total_price: int
    host_payout: int
    status: BookingStatus
    created_at: datetime


class HostStatsOut(BaseModel):
    listing_count: int
    upcoming_reservations: int
    total_earnings: int
    rating_avg: float
    review_count: int


class HostStatsResponse(BaseModel):
    data: HostStatsOut


class HostListingOptionsOut(BaseModel):
    property_types: list[str]
    amenities: list[AmenityOut]


class HostListingOptionsResponse(BaseModel):
    data: HostListingOptionsOut
