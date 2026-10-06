from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.dependencies import get_db_session, get_optional_user
from app.models.user import User
from app.schemas.listing import (
    FilterOptionsParams,
    ListingCardOut,
    ListingFilterOptionsResponse,
    ListingFilterParams,
    LocationSuggestionParams,
    LocationSuggestionsResponse,
)
from app.schemas.pagination import PaginatedResponse
from app.services.listing_service import (
    get_filter_options,
    list_listings,
    suggest_locations,
)

router = APIRouter(prefix="/listings", tags=["listings"])


@router.get("", response_model=PaginatedResponse[ListingCardOut])
def index(
    params: Annotated[ListingFilterParams, Query()],
    db: Session = Depends(get_db_session),
    user: Optional[User] = Depends(get_optional_user),
) -> PaginatedResponse[ListingCardOut]:
    return list_listings(db, params, user)


@router.get("/filter-options", response_model=ListingFilterOptionsResponse)
def filter_options(
    params: Annotated[FilterOptionsParams, Query()],
    db: Session = Depends(get_db_session),
) -> ListingFilterOptionsResponse:
    return ListingFilterOptionsResponse(data=get_filter_options(db, params.category))


@router.get("/locations", response_model=LocationSuggestionsResponse)
def locations(
    params: Annotated[LocationSuggestionParams, Query()],
    db: Session = Depends(get_db_session),
) -> LocationSuggestionsResponse:
    return LocationSuggestionsResponse(data=suggest_locations(db, params))
