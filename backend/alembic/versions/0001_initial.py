"""Initial schema and seat check allowing a full ride (available_seat = 0).

Revision ID: 0001_initial
Revises:
Create Date: 2026-09-15
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy import inspect as sa_inspect

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def _tables(bind) -> set[str]:
    return set(sa_inspect(bind).get_table_names())


def upgrade() -> None:
    bind = op.get_bind()
    existing = _tables(bind)
    uuid_type = (
        postgresql.UUID(as_uuid=True)
        if bind.dialect.name == "postgresql"
        else sa.String(36)
    )

    if "users" not in existing:
        op.create_table(
            "users",
            sa.Column("id", uuid_type, primary_key=True, nullable=False),
            sa.Column("full_name", sa.String(255), nullable=False),
            sa.Column("email", sa.String(255), nullable=False),
            sa.Column("university", sa.String(255), nullable=False),
            sa.Column("phone", sa.String(32), nullable=True),
            sa.Column("hashed_password", sa.String(255), nullable=False),
            sa.Column(
                "role",
                sa.String(16),
                nullable=False,
                server_default="student",
            ),
            sa.Column(
                "is_active",
                sa.Boolean(),
                nullable=False,
                server_default=sa.text("true"),
            ),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                nullable=False,
                server_default=sa.func.now(),
            ),
            sa.UniqueConstraint("email"),
        )
        op.create_index("ix_users_email", "users", ["email"], unique=True)

    if "ride_offers" not in existing:
        op.create_table(
            "ride_offers",
            sa.Column("id", uuid_type, primary_key=True, nullable=False),
            sa.Column("driver_id", uuid_type, nullable=False),
            sa.Column("pickup_location", sa.String(255), nullable=False),
            sa.Column("destination", sa.String(255), nullable=False),
            sa.Column("departure_time", sa.DateTime(timezone=True), nullable=False),
            sa.Column("fare", sa.Float(), nullable=False),
            sa.Column(
                "available_seat",
                sa.Integer(),
                nullable=False,
                server_default="2",
            ),
            sa.Column(
                "status",
                sa.String(32),
                nullable=False,
                server_default="active",
            ),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                nullable=False,
                server_default=sa.func.now(),
            ),
            sa.ForeignKeyConstraint(["driver_id"], ["users.id"], ondelete="CASCADE"),
            sa.CheckConstraint("available_seat >= 0", name="ck_available_seat_min_zero"),
            sa.CheckConstraint(
                "available_seat <= 2",
                name="ck_ride_offers_available_seat_max_two",
            ),
        )
        op.create_index("ix_ride_offers_driver_id", "ride_offers", ["driver_id"])
        op.create_index("ix_ride_offers_departure_time", "ride_offers", ["departure_time"])
        op.create_index("ix_ride_offers_status", "ride_offers", ["status"])
    elif bind.dialect.name == "postgresql":
        op.execute(
            "ALTER TABLE ride_offers DROP CONSTRAINT IF EXISTS ck_available_seat_min_one"
        )
        op.execute(
            "ALTER TABLE ride_offers DROP CONSTRAINT IF EXISTS ck_available_seat_min_zero"
        )
        op.execute(
            "ALTER TABLE ride_offers ADD CONSTRAINT ck_available_seat_min_zero "
            "CHECK (available_seat >= 0)"
        )

    if "ride_participants" not in existing:
        op.create_table(
            "ride_participants",
            sa.Column("id", uuid_type, primary_key=True, nullable=False),
            sa.Column("ride_id", uuid_type, nullable=False),
            sa.Column("user_id", uuid_type, nullable=False),
            sa.Column(
                "joined_at",
                sa.DateTime(timezone=True),
                nullable=False,
                server_default=sa.func.now(),
            ),
            sa.ForeignKeyConstraint(["ride_id"], ["ride_offers.id"], ondelete="CASCADE"),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
            sa.UniqueConstraint(
                "ride_id",
                "user_id",
                name="uq_ride_participants_ride_user",
            ),
        )
        op.create_index("ix_ride_participants_ride_id", "ride_participants", ["ride_id"])
        op.create_index("ix_ride_participants_user_id", "ride_participants", ["user_id"])


def downgrade() -> None:
    op.drop_table("ride_participants")
    op.drop_table("ride_offers")
    op.drop_table("users")
