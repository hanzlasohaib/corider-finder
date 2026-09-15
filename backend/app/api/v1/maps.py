from __future__ import annotations

import threading
import time
from functools import lru_cache

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/maps", tags=["maps"])

NOMINATIM_SEARCH = "https://nominatim.openstreetmap.org/search"
NOMINATIM_REVERSE = "https://nominatim.openstreetmap.org/reverse"
USER_AGENT = "CoRideFinder/1.0 (campus ride sharing; https://github.com/hanzlasohaib/corider-finder)"

_lock = threading.Lock()
_last_request_at = 0.0


def _nominatim_get(url: str, params: dict) -> dict | list | None:
    global _last_request_at
    with _lock:
        wait = 1.05 - (time.monotonic() - _last_request_at)
        if wait > 0:
            time.sleep(wait)
        try:
            response = httpx.get(
                url,
                params=params,
                headers={
                    "User-Agent": USER_AGENT,
                    "Accept": "application/json",
                },
                timeout=8.0,
            )
        finally:
            _last_request_at = time.monotonic()

    if response.status_code >= 400:
        return None
    return response.json()


def _place_from_search_hit(hit: dict) -> dict | None:
    try:
        lat = float(hit["lat"])
        lng = float(hit["lon"])
    except (KeyError, TypeError, ValueError):
        return None
    label = (hit.get("display_name") or "").strip()
    if not label:
        return None
    return {"lat": lat, "lng": lng, "label": label}


@lru_cache(maxsize=256)
def geocode_place(query: str) -> tuple[float, float, str] | None:
    q = query.strip()
    if len(q) < 2:
        return None
    biased = q if "pakistan" in q.lower() else f"{q}, Pakistan"
    data = _nominatim_get(
        NOMINATIM_SEARCH,
        {
            "q": biased,
            "format": "jsonv2",
            "limit": "1",
            "countrycodes": "pk",
        },
    )
    if not isinstance(data, list) or not data:
        return None
    place = _place_from_search_hit(data[0])
    if place is None:
        return None
    return place["lat"], place["lng"], place["label"]


@lru_cache(maxsize=256)
def reverse_place(lat: float, lng: float) -> tuple[float, float, str] | None:
    data = _nominatim_get(
        NOMINATIM_REVERSE,
        {
            "lat": f"{lat:.6f}",
            "lon": f"{lng:.6f}",
            "format": "jsonv2",
            "zoom": "16",
        },
    )
    if not isinstance(data, dict):
        return None
    place = _place_from_search_hit(data)
    if place is None:
        return None
    return place["lat"], place["lng"], place["label"]


@router.get("/geocode")
def geocode_endpoint(
    q: str = Query(..., min_length=2, max_length=255),
    current_user: User = Depends(get_current_user),
) -> dict:
    del current_user
    found = geocode_place(q)
    if found is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No map match for that place",
        )
    lat, lng, label = found
    return {"lat": lat, "lng": lng, "label": label}


@router.get("/reverse")
def reverse_endpoint(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
    current_user: User = Depends(get_current_user),
) -> dict:
    del current_user
    found = reverse_place(round(lat, 6), round(lng, 6))
    if found is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No address for that map point",
        )
    plat, plng, label = found
    return {"lat": plat, "lng": plng, "label": label}
