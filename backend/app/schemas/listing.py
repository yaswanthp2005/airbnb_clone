from __future__ import annotations

from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field, field_validator, model_validator

DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 50


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
    sort: ListingSort = ListingSort.recommended
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=DEFAULT_PAGE_SIZE, ge=1, le=MAX_PAGE_SIZE)

    @field_validator("property_type", "amenities", mode="before")
    @classmethod
    def parse_csv(cls, value: Any) -> Any:
        return _split_csv(value)

    @model_validator(mode="after")
    def check_price_range(self) -> "ListingFilterParams":
        if (
            self.min_price is not None
            and self.max_price is not None
            and self.min_price > self.max_price
        ):
            raise ValueError("min_price must be less than or equal to max_price")
        return self


class FilterOptionsParams(BaseModel):
    category: Optional[str] = Field(default=None, max_length=40)


class ListingCardOut(BaseModel):
    id: int
    title: str
    property_type: str
    city: str
    state: str
    country: str
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


class ListingFilterOptions(BaseModel):
    min_price: int
    max_price: int
    price_histogram: list[int]
    property_types: list[str]
    amenities: list[AmenityOut]


class ListingFilterOptionsResponse(BaseModel):
    data: ListingFilterOptions
