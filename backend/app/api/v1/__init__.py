from fastapi import APIRouter

from .routes import router as routes_router
from .auth import router as auth_router
from .rides import router as rides_router


router = APIRouter()
router.include_router(routes_router)
router.include_router(auth_router)
router.include_router(rides_router)

