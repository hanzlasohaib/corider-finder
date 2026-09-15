from __future__ import annotations

from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient

from app.models.ride_offer import RideOffer
from app.models.user import User


def _register_and_login(
    client: TestClient,
    email: str,
    name: str = "Ride User",
) -> str:
    register_payload = {
        "full_name": name,
        "email": email,
        "university": "Test University",
        "phone": "1234567890",
        "password": "strongpassword",
    }
    resp = client.post("/api/v1/auth/register", json=register_payload)
    assert resp.status_code == 201, resp.text

    resp = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "strongpassword"},
    )
    assert resp.status_code == 200, resp.text
    return resp.json()["access_token"]


def _auth(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def _future_ride_payload(**overrides) -> dict:
    payload = {
        "pickup_location": "Campus A",
        "destination": "Campus B",
        "departure_time": (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat(),
        "fare": 10.5,
        "available_seat": 2,
    }
    payload.update(overrides)
    return payload


def test_create_ride(client: TestClient) -> None:
    token = _register_and_login(client, "driver@example.com", "Ride Driver")
    resp = client.post(
        "/api/v1/rides",
        json=_future_ride_payload(),
        headers=_auth(token),
    )
    assert resp.status_code == 201, resp.text
    data = resp.json()
    assert data["pickup_location"] == "Campus A"
    assert data["destination"] == "Campus B"
    assert data["fare"] == 10.5
    assert data["status"] == "active"
    assert data["available_seat"] == 2
    assert "driver" in data


def test_second_active_ride_is_forbidden(client: TestClient) -> None:
    token = _register_and_login(client, "busy-driver@example.com")
    first = client.post("/api/v1/rides", json=_future_ride_payload(), headers=_auth(token))
    assert first.status_code == 201, first.text

    second = client.post(
        "/api/v1/rides",
        json=_future_ride_payload(pickup_location="Campus C"),
        headers=_auth(token),
    )
    assert second.status_code == 403


def test_driver_cannot_join_own_ride(client: TestClient) -> None:
    token = _register_and_login(client, "self-join@example.com")
    created = client.post("/api/v1/rides", json=_future_ride_payload(), headers=_auth(token))
    ride_id = created.json()["id"]

    resp = client.post(f"/api/v1/rides/{ride_id}/join", headers=_auth(token))
    assert resp.status_code == 403


def test_join_last_seat_and_leave(client: TestClient) -> None:
    driver = _register_and_login(client, "last-seat-driver@example.com")
    passenger = _register_and_login(client, "last-seat-rider@example.com")

    created = client.post(
        "/api/v1/rides",
        json=_future_ride_payload(available_seat=1),
        headers=_auth(driver),
    )
    assert created.status_code == 201, created.text
    ride_id = created.json()["id"]

    joined = client.post(f"/api/v1/rides/{ride_id}/join", headers=_auth(passenger))
    assert joined.status_code == 201, joined.text
    assert joined.json()["ride"]["available_seat"] == 0

    extra = _register_and_login(client, "late-rider@example.com")
    full = client.post(f"/api/v1/rides/{ride_id}/join", headers=_auth(extra))
    assert full.status_code == 400

    left = client.delete(f"/api/v1/rides/{ride_id}/leave", headers=_auth(passenger))
    assert left.status_code == 200, left.text


def test_cancel_requires_driver(client: TestClient) -> None:
    driver = _register_and_login(client, "cancel-driver@example.com")
    other = _register_and_login(client, "cancel-other@example.com")
    created = client.post("/api/v1/rides", json=_future_ride_payload(), headers=_auth(driver))
    ride_id = created.json()["id"]

    forbidden = client.patch(f"/api/v1/rides/{ride_id}/cancel", headers=_auth(other))
    assert forbidden.status_code == 403

    cancelled = client.patch(f"/api/v1/rides/{ride_id}/cancel", headers=_auth(driver))
    assert cancelled.status_code == 200
    assert cancelled.json()["status"] == "cancelled"


def test_user_created_and_joined_lists(client: TestClient) -> None:
    driver = _register_and_login(client, "lists-driver@example.com")
    rider = _register_and_login(client, "lists-rider@example.com")
    created = client.post("/api/v1/rides", json=_future_ride_payload(), headers=_auth(driver))
    ride_id = created.json()["id"]
    joined = client.post(f"/api/v1/rides/{ride_id}/join", headers=_auth(rider))
    assert joined.status_code == 201, joined.text

    mine = client.get("/api/v1/rides/user/created", headers=_auth(driver))
    assert mine.status_code == 200
    assert len(mine.json()) == 1

    joined_list = client.get("/api/v1/rides/user/joined", headers=_auth(rider))
    assert joined_list.status_code == 200
    assert len(joined_list.json()) == 1
    assert joined_list.json()[0]["ride"]["id"] == ride_id


def test_past_rides_are_not_listed(client: TestClient, db_session) -> None:
    driver = _register_and_login(client, "past-driver@example.com")
    rider = _register_and_login(client, "past-rider@example.com")

    user = db_session.query(User).filter(User.email == "past-driver@example.com").one()
    past_ride = RideOffer(
        driver_id=user.id,
        pickup_location="Old Campus",
        destination="Town",
        departure_time=datetime.now(timezone.utc) - timedelta(hours=2),
        fare=5,
        available_seat=2,
        status="active",
    )
    db_session.add(past_ride)
    db_session.commit()

    listed = client.get("/api/v1/rides", headers=_auth(rider))
    assert listed.status_code == 200
    assert all(item["pickup_location"] != "Old Campus" for item in listed.json())


def test_ride_detail_requires_auth(client: TestClient) -> None:
    token = _register_and_login(client, "detail-driver@example.com")
    created = client.post("/api/v1/rides", json=_future_ride_payload(), headers=_auth(token))
    ride_id = created.json()["id"]

    anonymous = client.get(f"/api/v1/rides/{ride_id}")
    assert anonymous.status_code in (401, 403)

    authed = client.get(f"/api/v1/rides/{ride_id}", headers=_auth(token))
    assert authed.status_code == 200
