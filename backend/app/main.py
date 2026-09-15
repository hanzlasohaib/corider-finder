from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import inspect, text

from app.api import api_router
from app.core.config import get_settings
from app.core.exceptions import init_exception_handlers
from app.core.logging_config import configure_logging
from app.core.middleware import init_middlewares
from app.db.base import Base
from app.db.session import engine

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    # Local/dev convenience. Production schema changes go through Alembic:
    #   alembic upgrade head
    if settings.ENV.lower() != "production":
        Base.metadata.create_all(bind=engine)
        inspector = inspect(engine)
        if "users" in inspector.get_table_names():
            columns = {column["name"] for column in inspector.get_columns("users")}
            if "role" not in columns:
                with engine.begin() as connection:
                    connection.execute(
                        text(
                            "ALTER TABLE users ADD COLUMN role VARCHAR(16) "
                            "NOT NULL DEFAULT 'student'"
                        )
                    )
    yield


app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
    lifespan=lifespan,
)

init_middlewares(app)
init_exception_handlers(app)

app.include_router(api_router, prefix="/api")
