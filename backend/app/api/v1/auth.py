from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, Form, Request
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.auth import TokenRefreshRequest
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.services.auth_service import (
    InvalidCredentialsError,
    UserAlreadyExistsError,
    authenticate_user,
    create_tokens,
    create_user,
    refresh_tokens,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
) -> UserResponse:
    try:
        user = create_user(db, user_in)
    except UserAlreadyExistsError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    return UserResponse.model_validate(user)


@router.post("/login")
async def login_user(
    request: Request,
    db: Session = Depends(get_db),
    # optional form fields for OAuth2 / form login
    username: Optional[str] = Form(None),
    password: Optional[str] = Form(None),
):
    """
    Login endpoint supports:
    - JSON body: {"email": "...", "password": "..."}
    - Form data: username=...&password=...
    """
    try:
        content_type = request.headers.get("content-type", "")

        if content_type.startswith("application/json"):
            body = await request.json()
            email = body.get("email")
            password = body.get("password")
        else:
            email = username
            password = password

        if not email or not password:
            raise HTTPException(status_code=422, detail="Username and password required")

        user = authenticate_user(db, email, password)
        tokens = create_tokens(user)
        return tokens

    except InvalidCredentialsError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.post("/refresh")
async def refresh_token(
    body: TokenRefreshRequest,
    db: Session = Depends(get_db),
) -> dict:
    """
    Refresh JWT tokens using refresh token
    """
    try:
        tokens = refresh_tokens(db, body.refresh_token)
        return tokens
    except InvalidCredentialsError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )