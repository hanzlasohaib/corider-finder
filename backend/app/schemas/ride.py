from __future__ import annotations

from datetime import datetime, timezone
from uuid import UUID

from pydantic import BaseModel, Field, field_validator
from pydantic import ConfigDict

from app.schemas.user import UserBasicResponse

class RideCreate(BaseModel):
    pickup_location: str = Field(..., min_length=1, max_length=255)
    destination: str = Field(..., min_length=1, max_length=255)
    departure_time: datetime
    fare: float = Field(..., ge=0)
    available_seat: int = Field(..., ge=1, le=2)

    model_config = ConfigDict(from_attributes=True)

    @field_validator("departure_time")
    @classmethod
    def departure_must_be_upcoming(cls, value: datetime) -> datetime:
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        if value < datetime.now(timezone.utc):
            raise ValueError("departure_time must be in the future")
        return value


class RideResponse(BaseModel):
    id: UUID
    driver_id: UUID
    pickup_location: str
    destination: str
    departure_time: datetime
    fare: float
    available_seat: int
    status: str

    driver: UserBasicResponse

    model_config = ConfigDict(from_attributes=True)


class RideJoinResponse(BaseModel):
    id: UUID
    ride_id: UUID
    user_id: UUID
    joined_at: datetime

    ride: RideResponse

    model_config = ConfigDict(from_attributes=True)

class JoinedRideResponse(BaseModel):
    ride: RideResponse
    joined_at: datetime

    model_config = ConfigDict(from_attributes=True)

class RideUpdate(BaseModel):
    pickup_location: str | None = Field(None, min_length=1, max_length=255)
    destination: str | None = Field(None, min_length=1, max_length=255)
    departure_time: datetime | None = None
    fare: float | None = Field(None, ge=0)
    available_seat: int | None = Field(None, ge=0, le=2)

    model_config = ConfigDict(from_attributes=True)