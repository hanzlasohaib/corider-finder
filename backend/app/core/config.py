from functools import lru_cache

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_PLACEHOLDER_SECRETS = {
    "change-me-in-production",
    "your-secret-key",
    "your_secret_key",
}

_DEFAULT_CORS_ORIGINS = (
    "http://localhost:5173",
    "http://127.0.0.1:5173",
)


class Settings(BaseSettings):
    APP_NAME: str = "CoRide Finder"
    ENV: str = "development"
    DEBUG: bool = False

    DATABASE_URL: str

    SECRET_KEY: str = Field(min_length=16)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    JWT_ALGORITHM: str = "HS256"

    # Comma-separated list of allowed CORS origins
    BACKEND_CORS_ORIGINS: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    @model_validator(mode="after")
    def reject_insecure_production_secret(self):
        key = (self.SECRET_KEY or "").strip()
        env = (self.ENV or "").lower()
        is_weak = len(key) < 16 or key.lower() in _PLACEHOLDER_SECRETS
        if is_weak and env == "production":
            raise ValueError(
                "SECRET_KEY must be a unique value of at least 16 characters in production"
            )
        return self

    def cors_origins(self) -> list[str]:
        if self.BACKEND_CORS_ORIGINS:
            origins = [
                origin.strip()
                for origin in self.BACKEND_CORS_ORIGINS.split(",")
                if origin.strip()
            ]
            if origins and origins != ["*"]:
                return origins
        return list(_DEFAULT_CORS_ORIGINS)


@lru_cache
def get_settings() -> Settings:
    return Settings()
