from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field
from pydantic import ConfigDict


class RideCreate(BaseModel):
    pickup_location: str = Field(..., min_length=1, max_length=255)
    destination: str = Field(..., min_length=1, max_length=255)
    departure_time: datetime
    fare: float = Field(..., ge=0)
    available_seat: int = Field(..., ge=1)

    model_config = ConfigDict(from_attributes=True)


class RideResponse(BaseModel):
    id: UUID
    driver_id: UUID
    pickup_location: str
    destination: str
    departure_time: datetime
    fare: float
    available_seat: int
    status: str

    model_config = ConfigDict(from_attributes=True)


class RideJoinResponse(BaseModel):
    id: UUID
    ride_id: UUID
    user_id: UUID
    joined_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RideUpdate(BaseModel):
    pickup_location: str | None = Field(None, min_length=1, max_length=255)
    destination: str | None = Field(None, min_length=1, max_length=255)
    departure_time: datetime | None = None
    fare: float | None = Field(None, ge=0)
    available_seat: int | None = Field(None, ge=1)

    model_config = ConfigDict(from_attributes=True)