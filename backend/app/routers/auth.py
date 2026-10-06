from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db_session
from app.models.user import User
from app.schemas.auth import (
    AuthResponse,
    AuthTokenPayload,
    LoginRequest,
    MeResponse,
    RegisterRequest,
    UserPublic,
)
from app.services.auth_service import login_user, register_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse)
def register(
    payload: RegisterRequest,
    db: Session = Depends(get_db_session),
) -> AuthResponse:
    user, token = register_user(db, payload)
    return AuthResponse(
        data=AuthTokenPayload(access_token=token, user=user),
        message="Account created successfully",
    )


@router.post("/login", response_model=AuthResponse)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db_session),
) -> AuthResponse:
    user, token = login_user(db, payload)
    return AuthResponse(
        data=AuthTokenPayload(access_token=token, user=user),
        message="Signed in successfully",
    )


@router.get("/me", response_model=MeResponse)
def me(current_user: User = Depends(get_current_user)) -> MeResponse:
    return MeResponse(data=UserPublic.model_validate(current_user))
