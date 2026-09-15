from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger("coride.exceptions")

def init_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
        try:
            body = await request.body()
            if isinstance(body, bytes):
                body = body.decode("utf-8", errors="replace")
        except Exception:
            body = "<could not read request body>"
        errors = exc.errors()
        logger.warning("Validation error on %s %s: %s, body=%s", request.method, request.url.path, errors, body)
        return JSONResponse(
            status_code=422,
            content={"detail": errors},
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        logger.exception("Unhandled error on %s %s", request.method, request.url.path)
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"},
        )