from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import List
from uuid import UUID, uuid4

from sqlalchemy import CheckConstraint, DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class RideOffer(Base):
    __tablename__ = "ride_offers"

    __table_args__ = (
        CheckConstraint("available_seat >= 0", name="ck_available_seat_positive"),
        CheckConstraint("available_seat <= 2", name="ck_ride_offers_available_seat_max_two"),
    )

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    driver_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    pickup_location: Mapped[str] = mapped_column(String(255), nullable=False)
    destination: Mapped[str] = mapped_column(String(255), nullable=False)
    departure_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
    )
    fare: Mapped[Decimal] = mapped_column(
        Float,
        nullable=False,
    )
    available_seat: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        server_default="2",
    )
    status: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
        server_default="active",
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    driver: Mapped["User"] = relationship(
        back_populates="rides_offered",
    )
    participants: Mapped[List["RideParticipant"]] = relationship(
        back_populates="ride",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def __repr__(self) -> str:
        return f"RideOffer(id={self.id!r}, driver_id={self.driver_id!r}, status={self.status!r})"

