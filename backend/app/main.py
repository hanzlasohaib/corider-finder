from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api import api_router
from app.core.config import get_settings
from app.core.exceptions import init_exception_handlers
from app.core.logging_config import configure_logging
from app.core.middleware import init_middlewares
from app.db.base import Base
from app.db.session import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    Base.metadata.create_all(bind=engine)
    yield


settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
    lifespan=lifespan,
)

init_middlewares(app)
init_exception_handlers(app)

app.include_router(api_router, prefix="/api")
