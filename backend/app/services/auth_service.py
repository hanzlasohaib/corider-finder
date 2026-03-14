from __future__ import annotations

from typing import Dict

from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    verify_password,
)
from app.models.user import User
from app.schemas.user import UserCreate
from app.services.user_service import get_user_by_email, get_user_by_id


class UserAlreadyExistsError(Exception):
    pass


class InvalidCredentialsError(Exception):
    pass


def create_user(db: Session, user_in: UserCreate) -> User:
    existing = get_user_by_email(db, user_in.email)
    if existing:
        raise UserAlreadyExistsError("Email already registered")

    hashed_password = get_password_hash(user_in.password)
    user = User(
        full_name=user_in.full_name,
        email=user_in.email,
        university=user_in.university,
        phone=user_in.phone,
        hashed_password=hashed_password,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User:
    user = get_user_by_email(db, email)
    if not user:
        raise InvalidCredentialsError("Invalid credentials")
    if not verify_password(password, user.hashed_password):
        raise InvalidCredentialsError("Invalid credentials")
    return user


def create_tokens(user: User) -> Dict[str, str]:
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


def refresh_tokens(db: Session, refresh_token: str) -> Dict[str, str]:
    token_data = decode_token(refresh_token)

    if token_data.sub is None:
        raise InvalidCredentialsError("Invalid refresh token")

    user = get_user_by_id(db, token_data.sub)
    if user is None:
        raise InvalidCredentialsError("Invalid refresh token")

    new_access_token = create_access_token(user.id)
    return {
        "access_token": new_access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }

