from fastapi import APIRouter

from app.core.config import settings
from app.schemas.health import (
    EchoRequest,
    EchoResponse,
    EchoResponseData,
    HealthResponse,
)

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    return HealthResponse(status="ok", app_name=settings.app_name)


@router.post("/health/echo", response_model=EchoResponse)
def health_echo(body: EchoRequest) -> EchoResponse:
    return EchoResponse(
        data=EchoResponseData(
            sample_field=body.sample_field,
            nested_items=body.nested_items,
        ),
        message="Echo successful",
    )
