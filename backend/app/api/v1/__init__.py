"""API version 1 router aggregation.

Each submodule defines its own router which is included here.
"""

from fastapi import APIRouter

from .auth import router as auth_router
from .users import router as users_router
from .institutions import router as institutions_router
from .cases import router as cases_router
from .overlaps import router as overlaps_router
from .coordination import router as coordination_router
from .reports import router as reports_router

v1_router = APIRouter()

v1_router.include_router(auth_router, prefix="/auth", tags=["auth"])
v1_router.include_router(users_router, prefix="/users", tags=["users"])
v1_router.include_router(institutions_router, prefix="/institutions", tags=["institutions"])
v1_router.include_router(cases_router, prefix="/cases", tags=["cases"])
v1_router.include_router(overlaps_router, prefix="/overlaps", tags=["overlaps"])
v1_router.include_router(coordination_router, prefix="/coordination", tags=["coordination"])
v1_router.include_router(reports_router, prefix="/reports", tags=["reports"])
