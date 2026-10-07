"""Shared fixtures: isolated SQLite file per test run, no demo seed."""

from __future__ import annotations

import os
import tempfile
from datetime import date, timedelta
from typing import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

_test_db_path: str | None = None


def pytest_configure(config: pytest.Config) -> None:
    global _test_db_path
    fd, _test_db_path = tempfile.mkstemp(prefix="airbnb_pytest_", suffix=".db")
    os.close(fd)
    os.environ["DATABASE_URL"] = f"sqlite:///{_test_db_path}"
    os.environ["SEED_ON_STARTUP"] = "false"


def pytest_sessionfinish(session: pytest.Session, exitstatus: int) -> None:
    if _test_db_path and os.path.isfile(_test_db_path):
        os.unlink(_test_db_path)


@pytest.fixture(scope="session")
def app():
    from app.main import app as fastapi_app

    return fastapi_app


@pytest.fixture(scope="session")
def client(app) -> Generator[TestClient, None, None]:
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def db() -> Generator[Session, None, None]:
    from app import models  # noqa: F401
    from app.core.database import Base, SessionLocal, engine

    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
        with engine.begin() as connection:
            for table in reversed(Base.metadata.sorted_tables):
                connection.execute(table.delete())


def future_date(days_from_today: int) -> date:
    return date.today() + timedelta(days=days_from_today)


@pytest.fixture
def host_user(db: Session):
    from app.core.security import hash_password
    from app.models.user import User

    user = User(
        name="Test Host",
        email="host@test.example",
        password_hash=hash_password("TestPass123"),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def guest_user(db: Session):
    from app.core.security import hash_password
    from app.models.user import User

    user = User(
        name="Test Guest",
        email="guest@test.example",
        password_hash=hash_password("TestPass123"),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def sample_listing(db: Session, host_user):
    from app.models.listing import Listing
    from app.models.listing_photo import ListingPhoto

    listing = Listing(
        host_id=host_user.id,
        title="Cozy Goa Villa",
        description="A test listing.",
        property_type="Villa",
        country="India",
        state="Goa",
        city="Panaji",
        address="123 Test Road",
        latitude=15.4909,
        longitude=73.8278,
        price_per_night=5000,
        cleaning_fee=500,
        max_guests=4,
        bedrooms=2,
        beds=2,
        bathrooms=1,
    )
    db.add(listing)
    db.flush()
    db.add(
        ListingPhoto(
            listing_id=listing.id,
            url="https://example.com/photo.jpg",
            position=0,
        )
    )
    db.commit()
    db.refresh(listing)
    return listing


def auth_headers(client: TestClient, email: str, password: str) -> dict[str, str]:
    response = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert response.status_code == 200, response.text
    token = response.json()["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}
