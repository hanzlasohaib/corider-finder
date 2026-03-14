from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.rides import router as rides_router
from app.api.v1.users import router as users_router
from app.core.config import get_settings


router = APIRouter()

# Health endpoint
@router.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    settings = get_settings()
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "env": settings.ENV,
    }

# Include feature routers
router.include_router(auth_router)
router.include_router(rides_router)
router.include_router(users_router)