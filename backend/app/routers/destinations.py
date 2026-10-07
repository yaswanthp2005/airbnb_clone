from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db_session
from app.schemas.destination import DestinationListResponse
from app.services.destination_service import list_destinations

router = APIRouter(prefix="/destinations", tags=["destinations"])


@router.get("", response_model=DestinationListResponse)
def index(db: Session = Depends(get_db_session)) -> DestinationListResponse:
    return DestinationListResponse(data=list_destinations(db))
