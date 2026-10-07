from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Path, Query
from sqlalchemy.orm import Session

from app.dependencies import get_db_session, get_optional_user
from app.models.user import User
from app.schemas.listing import (
    ListingCardOut,
    ListingDetailResponse,
    ListingFilterOptionsResponse,
    ListingFilterParams,
    LocationSuggestionParams,
    LocationSuggestionsResponse,
    PropertyTypeSummariesResponse,
    UnavailableDatesParams,
    UnavailableDatesResponse,
)
from app.schemas.pagination import PaginatedResponse
from app.schemas.review import ReviewListParams, ReviewOut
from app.services.listing_service import (
    get_filter_options,
    get_listing_detail,
    get_unavailable_dates,
    list_listings,
    list_property_types,
    suggest_locations,
)
from app.services.review_service import list_listing_reviews

router = APIRouter(prefix="/listings", tags=["listings"])

ListingId = Annotated[int, Path(ge=1)]


@router.get("", response_model=PaginatedResponse[ListingCardOut])
def index(
    params: Annotated[ListingFilterParams, Query()],
    db: Session = Depends(get_db_session),
    user: Optional[User] = Depends(get_optional_user),
) -> PaginatedResponse[ListingCardOut]:
    return list_listings(db, params, user)


@router.get("/filter-options", response_model=ListingFilterOptionsResponse)
def filter_options(db: Session = Depends(get_db_session)) -> ListingFilterOptionsResponse:
    return ListingFilterOptionsResponse(data=get_filter_options(db))


@router.get("/property-types", response_model=PropertyTypeSummariesResponse)
def property_types(db: Session = Depends(get_db_session)) -> PropertyTypeSummariesResponse:
    return PropertyTypeSummariesResponse(data=list_property_types(db))


@router.get("/locations", response_model=LocationSuggestionsResponse)
def locations(
    params: Annotated[LocationSuggestionParams, Query()],
    db: Session = Depends(get_db_session),
) -> LocationSuggestionsResponse:
    return LocationSuggestionsResponse(data=suggest_locations(db, params))


@router.get("/{listing_id}", response_model=ListingDetailResponse)
def show(
    listing_id: ListingId,
    db: Session = Depends(get_db_session),
    user: Optional[User] = Depends(get_optional_user),
) -> ListingDetailResponse:
    return ListingDetailResponse(data=get_listing_detail(db, listing_id, user))


@router.get("/{listing_id}/reviews", response_model=PaginatedResponse[ReviewOut])
def reviews(
    listing_id: ListingId,
    params: Annotated[ReviewListParams, Query()],
    db: Session = Depends(get_db_session),
) -> PaginatedResponse[ReviewOut]:
    return list_listing_reviews(db, listing_id, params)


@router.get("/{listing_id}/unavailable-dates", response_model=UnavailableDatesResponse)
def unavailable_dates(
    listing_id: ListingId,
    params: Annotated[UnavailableDatesParams, Query()],
    db: Session = Depends(get_db_session),
) -> UnavailableDatesResponse:
    return UnavailableDatesResponse(data=get_unavailable_dates(db, listing_id, params))
