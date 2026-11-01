"""Coordination workflow endpoints placeholder.
"""

from fastapi import APIRouter

router = APIRouter()

@router.get("/ping")
async def ping() -> dict:
    return {"msg": "coordination endpoint alive"}
