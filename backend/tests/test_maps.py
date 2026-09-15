from __future__ import annotations

from unittest.mock import patch

from fastapi.testclient import TestClient


def _register_and_login(client: TestClient) -> str:
    client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "Map User",
            "email": "map-user@example.com",
            "university": "Test University",
            "password": "strongpassword",
        },
    )
    resp = client.post(
        "/api/v1/auth/login",
        json={"email": "map-user@example.com", "password": "strongpassword"},
    )
    assert resp.status_code == 200, resp.text
    return resp.json()["access_token"]


def test_geocode_requires_auth(client: TestClient) -> None:
    resp = client.get("/api/v1/maps/geocode", params={"q": "Lahore"})
    assert resp.status_code == 401


def test_geocode_returns_place(client: TestClient) -> None:
    token = _register_and_login(client)
    with patch("app.api.v1.maps.geocode_place", return_value=(31.52, 74.35, "Lahore, Punjab, Pakistan")):
        resp = client.get(
            "/api/v1/maps/geocode",
            params={"q": "Lahore"},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert resp.status_code == 200
    data = resp.json()
    assert data["lat"] == 31.52
    assert data["lng"] == 74.35
    assert "Lahore" in data["label"]
