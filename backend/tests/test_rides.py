from __future__ import annotations

from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient


def create_user_and_get_token(client: TestClient) -> str:
    register_payload = {
        "full_name": "Ride Driver",
        "email": "driver@example.com",
        "university": "Test University",
        "phone": "1234567890",
        "password": "strongpassword",
    }
    resp = client.post("/api/v1/auth/register", json=register_payload)
    assert resp.status_code == 201

    login_payload = {
        "email": register_payload["email"],
        "password": register_payload["password"],
    }
    resp = client.post("/api/v1/auth/login", json=login_payload)
    assert resp.status_code == 200
    tokens = resp.json()
    return tokens["access_token"]


def test_create_ride(client: TestClient) -> None:
    access_token = create_user_and_get_token(client)

    departure_time = datetime.now(timezone.utc) + timedelta(hours=1)

    ride_payload = {
        "pickup_location": "Campus A",
        "destination": "Campus B",
        "departure_time": departure_time.isoformat(),
        "fare": 10.5,
    }

    resp = client.post(
        "/api/v1/rides",
        json=ride_payload,
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert resp.status_code == 201
    data = resp.json()
    assert data["pickup_location"] == ride_payload["pickup_location"]
    assert data["destination"] == ride_payload["destination"]
    assert data["fare"] == ride_payload["fare"]
    assert data["status"] == "active"

