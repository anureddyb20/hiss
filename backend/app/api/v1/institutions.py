"""Institution endpoints placeholder.

Implemented later – for now provides a simple health check.
"""

from fastapi import APIRouter

router = APIRouter()

@router.get("/ping")
async def ping() -> dict:
    return {"msg": "institutions endpoint alive"}
