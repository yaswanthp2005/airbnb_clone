def test_register_and_me(client):
    register = client.post(
        "/api/v1/auth/register",
        json={
            "name": "New User",
            "email": "newuser@test.example",
            "password": "SecurePass1",
        },
    )
    assert register.status_code == 200
    body = register.json()
    assert body["message"] == "Account created successfully"
    token = body["data"]["access_token"]

    me = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me.status_code == 200
    assert me.json()["data"]["email"] == "newuser@test.example"


def test_login_invalid_password(client, guest_user):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": guest_user.email, "password": "wrong-password"},
    )
    assert response.status_code == 401


def test_me_requires_auth(client):
    assert client.get("/api/v1/auth/me").status_code == 401
