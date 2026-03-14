from __future__ import annotations

import logging
import time
from typing import Callable

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import get_settings

logger = logging.getLogger("coride.middleware")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.perf_counter()
        response: Response | None = None
        try:
            response = await call_next(request)
            return response
        finally:
            process_time = (time.perf_counter() - start_time) * 1000
            status_code = response.status_code if response is not None else 500
            client_host = request.client.host if request.client else "unknown"
            logger.info(
                "%s %s - %d - %.2fms - %s",
                request.method,
                request.url.path,
                status_code,
                process_time,
                client_host,
            )


class RateLimitingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Placeholder for future rate limiting implementation
        response = await call_next(request)
        return response


def init_middlewares(app: FastAPI) -> None:
    settings = get_settings()

    if settings.BACKEND_CORS_ORIGINS:
        cors_origins = [origin.strip() for origin in settings.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]
    else:
        cors_origins = ["*"]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Request logging
    app.add_middleware(RequestLoggingMiddleware)

    # Rate limiting placeholder
    app.add_middleware(RateLimitingMiddleware)

