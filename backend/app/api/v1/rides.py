from __future__ import annotations

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.ride import RideCreate, RideResponse, RideJoinResponse, JoinedRideResponse
from app.services.ride_service import (
    RideAlreadyJoinedError,
    RideFullError,
    RideMatchCriteriaError,
    RideNotFoundError,
    RidePermissionError,
    cancel_ride,
    complete_ride,
    create_ride,
    delete_ride,
    find_matching_rides,
    get_ride_by_id,
    join_ride,
    leave_ride,
    list_available_rides,
    list_user_created_rides,
    list_user_joined_rides,
)

router = APIRouter(prefix="/rides", tags=["rides"])


# =========================
# Create Ride
# =========================

@router.post("", response_model=RideResponse, status_code=status.HTTP_201_CREATED)
def create_ride_endpoint(
    ride_in: RideCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RideResponse:
    try:
        ride = create_ride(db, current_user, ride_in)
    except RidePermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    return RideResponse.model_validate(ride)


# =========================
# List Available Rides
# =========================

@router.get("", response_model=List[RideResponse])
def list_rides_endpoint(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[RideResponse]:

    rides = list_available_rides(db, current_user=current_user, skip=skip, limit=limit)

    return [RideResponse.model_validate(r) for r in rides]


# =========================
# Match Rides
# =========================

@router.get("/matches", response_model=List[RideResponse])
def match_rides_endpoint(
    pickup: Optional[str] = Query(default=None),
    destination: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[RideResponse]:

    try:
        rides = find_matching_rides(db, current_user=current_user, pickup=pickup, destination=destination)
    except RideMatchCriteriaError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    return [RideResponse.model_validate(r) for r in rides]


# =========================
# User Created Rides
# =========================

@router.get("/user/created", response_model=List[RideResponse])
def list_user_created_rides_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[RideResponse]:

    rides = list_user_created_rides(db, current_user)
    return [RideResponse.model_validate(r) for r in rides]


# =========================
# User Joined Rides
# =========================

@router.get("/user/joined", response_model=List[JoinedRideResponse])
def list_user_joined_rides_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[JoinedRideResponse]:

    rides = list_user_joined_rides(db, current_user)

    return [
        JoinedRideResponse(
            joined_at=r.joined_at,
            ride=RideResponse.model_validate(r.ride),
        )
        for r in rides
    ]


# =========================
# Get Ride By ID
# =========================

@router.get("/{ride_id}", response_model=RideResponse)
def get_ride_endpoint(
    ride_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RideResponse:

    try:
        ride = get_ride_by_id(db, ride_id)
    except RideNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ride not found",
        )

    return RideResponse.model_validate(ride)


# =========================
# Cancel Ride (Driver)
# =========================

@router.patch("/{ride_id}/cancel", response_model=RideResponse)
def cancel_ride_endpoint(
    ride_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RideResponse:

    try:
        ride = cancel_ride(db, ride_id, current_user)
    except RideNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ride not found",
        )
    except RidePermissionError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to cancel this ride",
        )

    return RideResponse.model_validate(ride)


# =========================
# Complete Ride (Driver)
# =========================

@router.post("/{ride_id}/complete", response_model=RideResponse)
def complete_ride_endpoint(
    ride_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RideResponse:

    try:
        ride = complete_ride(db, ride_id, current_user)
    except RideNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ride not found",
        )
    except RidePermissionError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to complete this ride",
        )

    return RideResponse.model_validate(ride)


# =========================
# Delete Ride (Driver)
# =========================

@router.delete("/{ride_id}", response_model=RideResponse)
def delete_ride_endpoint(
    ride_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RideResponse:

    try:
        ride = delete_ride(db, ride_id, current_user)
    except RideNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ride not found",
        )
    except RidePermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )

    return RideResponse.model_validate(ride)


# =========================
# Join Ride
# =========================

@router.post(
    "/{ride_id}/join",
    response_model=RideJoinResponse,
    status_code=status.HTTP_201_CREATED,
)
def join_ride_endpoint(
    ride_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RideJoinResponse:

    try:
        participant = join_ride(db, ride_id, current_user)

    except RideNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ride not found",
        )

    except RidePermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )

    except RideFullError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ride is full",
        )

    except RideAlreadyJoinedError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already joined this ride",
        )

    return RideJoinResponse.model_validate(participant)


# =========================
# Leave Ride
# =========================

@router.delete("/{ride_id}/leave", response_model=RideJoinResponse)
def leave_ride_endpoint(
    ride_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RideJoinResponse:

    try:
        participant = leave_ride(db, ride_id, current_user)

    except RideNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ride not found",
        )

    except RidePermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )

    return RideJoinResponse.model_validate(participant)


# =========================
# (user collection routes are declared above /{ride_id})