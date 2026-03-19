from __future__ import annotations

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

from app.models.user import User
from app.models.ride_offer import RideOffer

class RideParticipant(Base):
    __tablename__ = "ride_participants"

    __table_args__ = (
        UniqueConstraint("ride_id", "user_id", name="uq_ride_participants_ride_user"),
    )

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
    ride_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("ride_offers.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    joined_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    ride: Mapped["RideOffer"] = relationship(
        back_populates="participants",
    )
    user: Mapped["User"] = relationship(
        back_populates="rides_joined",
    )

    def __repr__(self) -> str:
        return f"RideParticipant(id={self.id!r}, ride_id={self.ride_id!r}, user_id={self.user_id!r})"

