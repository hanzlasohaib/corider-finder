from __future__ import annotations

from typing import Optional
from uuid import UUID

from pydantic import BaseModel
from pydantic import ConfigDict


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: Optional[UUID] = None
    exp: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class TokenRefreshRequest(BaseModel):
    refresh_token: str


