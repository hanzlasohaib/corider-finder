from __future__ import annotations

import os
from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

# Ensure test database URL is used before importing app components
TEST_DATABASE_URL = "sqlite:///./test.db"
os.environ.setdefault("DATABASE_URL", TEST_DATABASE_URL)

from app.main import app  # noqa: E402
from app.db.base import Base  # noqa: E402
from app.db.session import engine, SessionLocal, get_db  # noqa: E402


@pytest.fixture(scope="session", autouse=True)
def setup_test_database() -> Generator[None, None, None]:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    try:
        yield
    finally:
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db_session(setup_test_database: None) -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="session")
def client(setup_test_database: None) -> Generator[TestClient, None, None]:
    def override_get_db() -> Generator[Session, None, None]:
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

