from __future__ import annotations

from pydantic import BaseModel


class DestinationOut(BaseModel):
    id: int
    city: str
    state: str
    country: str
    tagline: str
    image_url: str

    model_config = {"from_attributes": True}


class DestinationListResponse(BaseModel):
    data: list[DestinationOut]
