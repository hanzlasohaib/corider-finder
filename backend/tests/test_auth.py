from __future__ import annotations

from fastapi.testclient import TestClient


def test_register_and_login_flow(client: TestClient) -> None:
    register_payload = {
        "full_name": "Test User",
        "email": "test@example.com",
        "university": "Test University",
        "phone": "1234567890",
        "password": "strongpassword",
    }

    # Register
    resp = client.post("/api/v1/auth/register", json=register_payload)
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == register_payload["email"]
    assert "id" in data
    assert "hashed_password" not in data

    # Login
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

