from tests.conftest import auth_headers, future_date


def test_create_booking_via_api(client, guest_user, sample_listing):
    headers = auth_headers(client, guest_user.email, "TestPass123")
    check_in = future_date(30)
    check_out = future_date(33)

    response = client.post(
        "/api/v1/bookings",
        headers=headers,
        json={
            "listing_id": sample_listing.id,
            "check_in": check_in.isoformat(),
            "check_out": check_out.isoformat(),
            "guests": 2,
        },
    )
    assert response.status_code == 201
    data = response.json()["data"]
    assert data["listing"]["slug"] == sample_listing.slug
    assert data["nights"] == 3
    assert data["total_price"] > 0


def test_listing_detail_by_slug(client, sample_listing):
    response = client.get(f"/api/v1/listings/{sample_listing.slug}")
    assert response.status_code == 200
    assert response.json()["data"]["title"] == sample_listing.title
