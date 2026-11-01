"""Case management endpoints placeholder.

Will be expanded with full CRUD, filtering, pagination.
"""

from fastapi import APIRouter

router = APIRouter()

@router.get("/ping")
async def ping() -> dict:
    return {"msg": "cases endpoint alive"}
