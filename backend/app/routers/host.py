from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db_session
from app.models.user import User
from app.schemas.host import (
    HostBookingOut,
    HostBookingsParams,
    HostListingDeleteOut,
    HostListingDeleteResponse,
    HostListingIn,
    HostListingMutationResponse,
    HostListingOptionsResponse,
    HostListingOut,
    HostListingResponse,
    HostPageParams,
    HostStatsResponse,
)
from app.schemas.pagination import PaginatedResponse
from app.services.host_service import (
    LISTING_CREATED_MESSAGE,
    LISTING_DELETED_MESSAGE,
    LISTING_UPDATED_MESSAGE,
    create_host_listing,
    delete_host_listing,
    get_host_listing,
    get_host_stats,
    get_listing_options,
    list_host_bookings,
    list_host_listings,
    update_host_listing,
)

router = APIRouter(prefix="/host", tags=["host"])

ListingId = Annotated[int, Path(ge=1)]


@router.get("/listing-options", response_model=HostListingOptionsResponse)
def listing_options(
    db: Session = Depends(get_db_session),
    _user: User = Depends(get_current_user),
) -> HostListingOptionsResponse:
    return HostListingOptionsResponse(data=get_listing_options(db))


@router.get("/stats", response_model=HostStatsResponse)
def stats(
    db: Session = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> HostStatsResponse:
    return HostStatsResponse(data=get_host_stats(db, user))


@router.get("/listings", response_model=PaginatedResponse[HostListingOut])
def listings(
    params: Annotated[HostPageParams, Query()],
    db: Session = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> PaginatedResponse[HostListingOut]:
    return list_host_listings(db, user, params)


@router.post(
    "/listings", response_model=HostListingMutationResponse, status_code=status.HTTP_201_CREATED
)
def create_listing(
    payload: HostListingIn,
    db: Session = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> HostListingMutationResponse:
    return HostListingMutationResponse(
        data=create_host_listing(db, user, payload), message=LISTING_CREATED_MESSAGE
    )


@router.get("/listings/{listing_id}", response_model=HostListingResponse)
def show_listing(
    listing_id: ListingId,
    db: Session = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> HostListingResponse:
    return HostListingResponse(data=get_host_listing(db, user, listing_id))


@router.put("/listings/{listing_id}", response_model=HostListingMutationResponse)
def update_listing(
    listing_id: ListingId,
    payload: HostListingIn,
    db: Session = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> HostListingMutationResponse:
    return HostListingMutationResponse(
        data=update_host_listing(db, user, listing_id, payload), message=LISTING_UPDATED_MESSAGE
    )


@router.delete("/listings/{listing_id}", response_model=HostListingDeleteResponse)
def delete_listing(
    listing_id: ListingId,
    db: Session = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> HostListingDeleteResponse:
    return HostListingDeleteResponse(
        data=HostListingDeleteOut(id=delete_host_listing(db, user, listing_id)),
        message=LISTING_DELETED_MESSAGE,
    )


@router.get("/bookings", response_model=PaginatedResponse[HostBookingOut])
def bookings(
    params: Annotated[HostBookingsParams, Query()],
    db: Session = Depends(get_db_session),
    user: User = Depends(get_current_user),
) -> PaginatedResponse[HostBookingOut]:
    return list_host_bookings(db, user, params)
