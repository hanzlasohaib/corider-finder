from __future__ import annotations

from fastapi.testclient import TestClient

from app.models.user import User


def test_register_and_login_flow(client: TestClient) -> None:
    register_payload = {
        "full_name": "Test User",
        "email": "test@example.com",
        "university": "Test University",
        "phone": "1234567890",
        "password": "strongpassword",
    }

    resp = client.post("/api/v1/auth/register", json=register_payload)
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == register_payload["email"]
    assert data["role"] == "student"
    assert "id" in data
    assert "hashed_password" not in data

    login_payload = {
        "email": register_payload["email"],
        "password": register_payload["password"],
    }
    resp = client.post("/api/v1/auth/login", json=login_payload)
    assert resp.status_code == 200
    tokens = resp.json()
    assert "access_token" in tokens
    assert "refresh_token" in tokens
    assert tokens["token_type"] == "bearer"
    assert tokens["role"] == "student"

    me = client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {tokens['access_token']}"},
    )
    assert me.status_code == 200
    assert me.json()["role"] == "student"


def test_refresh_rejects_access_token(client: TestClient) -> None:
    client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Refresh User",
            "email": "refresh@example.com",
            "university": "Test University",
            "phone": "1234567890",
            "password": "strongpassword",
        },
    )
    tokens = client.post(
        "/api/v1/auth/login",
        json={"email": "refresh@example.com", "password": "strongpassword"},
    ).json()

    resp = client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": tokens["access_token"]},
    )
    assert resp.status_code == 401


def test_protected_route_rejects_refresh_token(client: TestClient) -> None:
    client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Bearer User",
            "email": "bearer@example.com",
            "university": "Test University",
            "phone": "1234567890",
            "password": "strongpassword",
        },
    )
    tokens = client.post(
        "/api/v1/auth/login",
        json={"email": "bearer@example.com", "password": "strongpassword"},
    ).json()

    resp = client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {tokens['refresh_token']}"},
    )
    assert resp.status_code == 401


def test_inactive_user_cannot_login(client: TestClient, db_session) -> None:
    client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Inactive User",
            "email": "inactive@example.com",
            "university": "Test University",
            "phone": "1234567890",
            "password": "strongpassword",
        },
    )
    user = db_session.query(User).filter(User.email == "inactive@example.com").one()
    user.is_active = False
    db_session.commit()

    resp = client.post(
        "/api/v1/auth/login",
        json={"email": "inactive@example.com", "password": "strongpassword"},
    )
    assert resp.status_code == 401


def test_validation_error_does_not_echo_password(client: TestClient) -> None:
    resp = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "X",
            "email": "not-an-email",
            "university": "Test",
            "password": "supersecretpassword",
        },
    )
    assert resp.status_code == 422
    body = resp.json()
    assert "body" not in body
    assert "supersecretpassword" not in resp.text


def test_login_cors_preflight_from_vite(client: TestClient) -> None:
    resp = client.options(
        "/api/v1/auth/login",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type,authorization",
        },
    )
    assert resp.status_code == 200
    assert resp.headers.get("access-control-allow-origin") == "http://localhost:5173"
    allow_headers = (resp.headers.get("access-control-allow-headers") or "").lower()
    assert "content-type" in allow_headers
    assert "authorization" in allow_headers


def test_student_cannot_use_admin_portal(client: TestClient) -> None:
    client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Portal User",
            "email": "portal@example.com",
            "university": "Test University",
            "password": "strongpassword",
        },
    )
    resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": "portal@example.com",
            "password": "strongpassword",
            "portal": "admin",
        },
    )
    assert resp.status_code == 403


def test_admin_portal_accepts_admin(client: TestClient, db_session) -> None:
    client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Staff User",
            "email": "staff@example.com",
            "university": "Test University",
            "password": "strongpassword",
        },
    )
    user = db_session.query(User).filter(User.email == "staff@example.com").one()
    user.role = "admin"
    db_session.commit()

    resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": "staff@example.com",
            "password": "strongpassword",
            "portal": "admin",
        },
    )
    assert resp.status_code == 200
    assert resp.json()["role"] == "admin"


def test_register_ignores_requested_admin_role(client: TestClient) -> None:
    resp = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Sneaky User",
            "email": "sneaky@example.com",
            "university": "Test University",
            "password": "strongpassword",
            "role": "admin",
        },
    )
    assert resp.status_code == 201
    assert resp.json()["role"] == "student"
