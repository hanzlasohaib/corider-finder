from __future__ import annotations

from typing import List, Optional
from uuid import UUID

from sqlalchemy.orm import Session, joinedload

from app.models.ride_offer import RideOffer
from app.models.ride_participant import RideParticipant
from app.models.user import User
from app.schemas.ride import RideCreate, RideUpdate



# =========================
# Custom Exceptions
# =========================

class RideNotFoundError(Exception):
    pass


class RidePermissionError(Exception):
    pass


class RideFullError(Exception):
    pass


class RideAlreadyJoinedError(Exception):
    pass


class RideMatchCriteriaError(Exception):
    pass


# =========================
# Core Ride Logic
# =========================

def create_ride(db: Session, driver: User, ride_in: RideCreate) -> RideOffer:
    ride = RideOffer(
        driver_id=driver.id,
        pickup_location=ride_in.pickup_location,
        destination=ride_in.destination,
        departure_time=ride_in.departure_time,
        fare=ride_in.fare,
        available_seat=ride_in.available_seat,
        status="active",
    )

    db.add(ride)
    db.commit()
    db.refresh(ride)

    return ride


def list_available_rides(
    db: Session,
    current_user: User,
    skip: int = 0,
    limit: int = 20,
) -> List[RideOffer]:

    return (
        db.query(RideOffer)
        .options(joinedload(RideOffer.driver))
        .filter(
            RideOffer.status == "active",
            RideOffer.available_seat > 0,
            RideOffer.driver_id != current_user.id,  # <--- exclude own rides
        )
        .order_by(RideOffer.departure_time.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_ride_by_id(db: Session, ride_id: UUID) -> RideOffer:
    ride = db.query(RideOffer).filter(RideOffer.id == ride_id).first()

    if not ride:
        raise RideNotFoundError("Ride not found")

    return ride


# =========================
# Driver Actions
# =========================

def cancel_ride(db: Session, ride_id: UUID, user: User) -> RideOffer:
    ride = get_ride_by_id(db, ride_id)

    if ride.driver_id != user.id:
        raise RidePermissionError("Only the driver can cancel this ride")

    if ride.status != "active":
        raise RidePermissionError("Only active rides can be cancelled")

    ride.status = "cancelled"

    db.commit()
    db.refresh(ride)

    return ride


def complete_ride(db: Session, ride_id: UUID, user: User) -> RideOffer:
    ride = get_ride_by_id(db, ride_id)

    if ride.driver_id != user.id:
        raise RidePermissionError("Only the driver can complete this ride")

    if ride.status != "active":
        raise RidePermissionError("Only active rides can be completed")

    ride.status = "completed"

    db.commit()
    db.refresh(ride)

    return ride


def delete_ride(db: Session, ride_id: UUID, user: User) -> RideOffer:
    ride = get_ride_by_id(db, ride_id)

    if ride.driver_id != user.id:
        raise RidePermissionError("Only the driver can delete this ride")

    if ride.status == "completed":
        raise RidePermissionError("Completed rides cannot be deleted")

    db.delete(ride)
    db.commit()

    return ride


def update_ride(
    db: Session,
    ride_id: UUID,
    user: User,
    ride_in: RideUpdate,
) -> RideOffer:

    ride = get_ride_by_id(db, ride_id)

    if ride.driver_id != user.id:
        raise RidePermissionError("Only the driver can update this ride")

    if ride.status != "active":
        raise RidePermissionError("Only active rides can be updated")

    if ride_in.pickup_location is not None:
        ride.pickup_location = ride_in.pickup_location

    if ride_in.destination is not None:
        ride.destination = ride_in.destination

    if ride_in.departure_time is not None:
        ride.departure_time = ride_in.departure_time

    if ride_in.fare is not None:
        ride.fare = ride_in.fare

    if ride_in.available_seat is not None:

        if ride_in.available_seat < 0:
            raise ValueError("Available seats cannot be negative")

        current_participants = (
            db.query(RideParticipant)
            .filter(RideParticipant.ride_id == ride.id)
            .count()
        )

        if ride_in.available_seat < current_participants:
            raise ValueError(
                "Available seats cannot be less than current participants"
            )

        ride.available_seat = ride_in.available_seat

    db.commit()
    db.refresh(ride)

    return ride


# =========================
# Passenger Actions
# =========================

def join_ride(db: Session, ride_id: UUID, user: User) -> RideParticipant:

    ride = (
        db.query(RideOffer)
        .options(joinedload(RideOffer.driver))
        .filter(RideOffer.id == ride_id)
        .with_for_update()
        .first()
    )

    if not ride:
        raise RideNotFoundError("Ride not found")

    if ride.driver_id == user.id:
        raise RidePermissionError("Driver cannot join their own ride")

    if ride.status != "active":
        raise RidePermissionError("Ride is not active")

    if ride.available_seat <= 0:
        raise RideFullError("Ride is full")

    existing = (
        db.query(RideParticipant)
        .filter(
            RideParticipant.ride_id == ride.id,
            RideParticipant.user_id == user.id,
        )
        .first()
    )

    if existing:
        raise RideAlreadyJoinedError("You have already joined this ride")

    participant = RideParticipant(
        ride_id=ride.id,
        user_id=user.id,
    )

    ride.available_seat -= 1

    db.add(participant)

    db.commit()
    db.refresh(participant)

    return participant


def leave_ride(db: Session, ride_id: UUID, user: User) -> RideParticipant:

    ride = get_ride_by_id(db, ride_id)

    if ride.driver_id == user.id:
        raise RidePermissionError("Driver cannot leave their own ride")

    if ride.status != "active":
        raise RidePermissionError("Ride is not active")

    participant = (
        db.query(RideParticipant)
        .filter(
            RideParticipant.ride_id == ride.id,
            RideParticipant.user_id == user.id,
        )
        .first()
    )

    if not participant:
        raise RideNotFoundError("You are not a participant of this ride")

    db.delete(participant)

    ride.available_seat += 1

    db.commit()

    return participant


# =========================
# Search / Listing
# =========================

def find_matching_rides(
    db: Session,
    current_user: User,
    pickup: Optional[str] = None,
    destination: Optional[str] = None,
) -> List[RideOffer]:

    if not pickup and not destination:
        return list_available_rides(db, current_user)

    query = db.query(RideOffer).filter(
        RideOffer.status == "active",
        RideOffer.available_seat > 0,
        RideOffer.driver_id != current_user.id,  # EXCLUDE OWN RIDES
    )

    if pickup:
        query = query.filter(
            RideOffer.pickup_location.ilike(f"%{pickup}%")
        )

    if destination:
        query = query.filter(
            RideOffer.destination.ilike(f"%{destination}%")
        )

    return query.order_by(RideOffer.departure_time.asc()).all()


def list_user_created_rides(db: Session, user: User) -> List[RideOffer]:

    return db.query(RideOffer).filter(
        RideOffer.driver_id == user.id
    ).all()


def list_user_joined_rides(db: Session, user: User) -> List[RideParticipant]:

    return (
        db.query(RideParticipant)
        .options(joinedload(RideParticipant.ride).joinedload(RideOffer.driver))
        .filter(RideParticipant.user_id == user.id)
        .all()
    )