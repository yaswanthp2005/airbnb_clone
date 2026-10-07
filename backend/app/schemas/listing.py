from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field, field_validator, model_validator

DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 50
MAX_GUESTS = 50
MAX_LOCATION_LENGTH = 100
DEFAULT_LOCATION_SUGGESTIONS = 6
MAX_LOCATION_SUGGESTIONS = 20
DEFAULT_AVAILABILITY_WINDOW_DAYS = 365
MAX_AVAILABILITY_WINDOW_DAYS = 731


class ListingSort(str, Enum):
    recommended = "recommended"
    price_asc = "price_asc"
    price_desc = "price_desc"
    rating_desc = "rating_desc"
    newest = "newest"


def _split_csv(value: Any) -> Any:
    """Accept `a,b` as well as repeated `?key=a&key=b` query params."""
    if value is None or value == "":
        return []
    raw_values = value if isinstance(value, list) else [value]
    return [
        part.strip()
        for raw in raw_values
        for part in str(raw).split(",")
        if part.strip()
    ]


class ListingFilterParams(BaseModel):
    category: Optional[str] = Field(default=None, max_length=40)
    min_price: Optional[int] = Field(default=None, ge=0)
    max_price: Optional[int] = Field(default=None, ge=0)
    property_type: list[str] = Field(default_factory=list)
    amenities: list[int] = Field(default_factory=list)
    bedrooms: Optional[int] = Field(default=None, ge=1, le=50)
    location: Optional[str] = Field(default=None, max_length=MAX_LOCATION_LENGTH)
    check_in: Optional[date] = None
    check_out: Optional[date] = None
    guests: Optional[int] = Field(default=None, ge=1, le=MAX_GUESTS)
    sort: ListingSort = ListingSort.recommended
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE)

    @field_validator("property_type", "amenities", mode="before")
    @classmethod
    def parse_csv(cls, value: Any) -> Any:
        return _split_csv(value)

    @field_validator("location", mode="before")
    @classmethod
    def blank_location_to_none(cls, value: Any) -> Any:
        if isinstance(value, str):
            return value.strip() or None
        return value

    @model_validator(mode="after")
    def check_price_range(self) -> "ListingFilterParams":
        if (
            self.min_price is not None
            and self.max_price is not None
            and self.min_price > self.max_price
        ):
            raise ValueError("min_price must be less than or equal to max_price")
        return self

    @model_validator(mode="after")
    def check_dates(self) -> "ListingFilterParams":
        if (self.check_in is None) != (self.check_out is None):
            raise ValueError("check_in and check_out must be provided together")
        if self.check_in and self.check_out and self.check_out <= self.check_in:
            raise ValueError("check_out must be after check_in")
        return self


class LocationSuggestionParams(BaseModel):
    q: str = Field(default="", max_length=MAX_LOCATION_LENGTH)
    limit: int = Field(
        default=DEFAULT_LOCATION_SUGGESTIONS, ge=1, le=MAX_LOCATION_SUGGESTIONS
    )

    @field_validator("q", mode="before")
    @classmethod
    def strip_query(cls, value: Any) -> Any:
        return value.strip() if isinstance(value, str) else value


class LocationSuggestion(BaseModel):
    city: str
    state: str
    country: str
    listing_count: int


class LocationSuggestionsResponse(BaseModel):
    data: list[LocationSuggestion]


class FilterOptionsParams(BaseModel):
    category: Optional[str] = Field(default=None, max_length=40)


class ListingCardOut(BaseModel):
    id: int
    title: str
    property_type: str
    city: str
    state: str
    country: str
    latitude: float
    longitude: float
    price_per_night: int
    bedrooms: int
    beds: int
    max_guests: int
    rating_avg: float
    review_count: int
    photos: list[str]
    is_wishlisted: bool


class AmenityOut(BaseModel):
    id: int
    name: str
    icon: Optional[str] = None

    model_config = {"from_attributes": True}


class ListingHostOut(BaseModel):
    id: int
    name: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    joined_at: datetime
    listing_count: int
    review_count: int
    rating_avg: float


class RatingCount(BaseModel):
    rating: int
    count: int


class ListingDetailOut(BaseModel):
    id: int
    title: str
    description: str
    property_type: str
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
    rating_avg: float
    review_count: int
    rating_breakdown: list[RatingCount]
    photos: list[str]
    amenities: list[AmenityOut]
    host: ListingHostOut
    is_wishlisted: bool


class ListingDetailResponse(BaseModel):
    data: ListingDetailOut


class UnavailableDatesParams(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None

    @model_validator(mode="after")
    def check_window(self) -> "UnavailableDatesParams":
        if self.start_date and self.end_date:
            if self.end_date <= self.start_date:
                raise ValueError("end_date must be after start_date")
            if (self.end_date - self.start_date).days > MAX_AVAILABILITY_WINDOW_DAYS:
                raise ValueError(
                    f"date window cannot exceed {MAX_AVAILABILITY_WINDOW_DAYS} days"
                )
        return self


class UnavailableDatesResponse(BaseModel):
    data: list[date]


class ListingFilterOptions(BaseModel):
    min_price: int
    max_price: int
    price_histogram: list[int]
    property_types: list[str]
    amenities: list[AmenityOut]


class ListingFilterOptionsResponse(BaseModel):
    data: ListingFilterOptions
