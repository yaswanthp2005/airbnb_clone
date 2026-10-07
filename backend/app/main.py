from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.init_db import init_database
from app.routers.auth import router as auth_router
from app.routers.bookings import router as bookings_router
from app.routers.health import router as health_router
from app.routers.host import router as host_router
from app.routers.listings import router as listings_router
from app.routers.wishlist import router as wishlist_router


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_database()
    yield


app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    lifespan=lifespan,
)

origins = [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
app.include_router(listings_router, prefix="/api/v1")
app.include_router(bookings_router, prefix="/api/v1")
app.include_router(wishlist_router, prefix="/api/v1")
app.include_router(host_router, prefix="/api/v1")

VALIDATION_FAILED_MESSAGE = "Validation failed"


def _validation_message(errors: list[dict]) -> str:
    """Surface model-level rules (e.g. "Checkout must be after check-in") as the message."""
    first = errors[0] if errors else {}
    if first.get("type") == "value_error" and first.get("ctx", {}).get("error"):
        return str(first["ctx"]["error"])
    field = next((part for part in reversed(first.get("loc", ())) if isinstance(part, str)), None)
    if field and field != "body" and first.get("msg"):
        return f"{field.replace('_', ' ').capitalize()}: {first['msg']}"
    return VALIDATION_FAILED_MESSAGE


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(
    _request: Request, exc: StarletteHTTPException
) -> JSONResponse:
    errors = exc.detail if isinstance(exc.detail, list) else None
    message = exc.detail if isinstance(exc.detail, str) else "Request failed"
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": message, "errors": errors},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    _request: Request, exc: RequestValidationError
) -> JSONResponse:
    errors = exc.errors()
    return JSONResponse(
        status_code=422,
        content={
            "message": _validation_message(errors),
            "errors": jsonable_encoder(errors, custom_encoder={Exception: str}),
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(
    _request: Request, _exc: Exception
) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error", "errors": None},
    )
