import logging

from .config import get_settings


def configure_logging() -> None:
    settings = get_settings()

    log_level = logging.DEBUG if settings.DEBUG else logging.INFO

    logging.basicConfig(
        level=log_level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )

