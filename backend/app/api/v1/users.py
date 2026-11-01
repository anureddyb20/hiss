"""User management endpoints.

- GET /me – returns the authenticated user's basic profile.
- GET / – list all users (admin only).
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from ..dependencies import get_async_session, get_current_user, require_role
from ...schemas.user import UserRead
from ...models.user import RoleName
from ...crud import user as user_crud

router = APIRouter()

@router.get("/me", response_model=UserRead)
async def read_current_user(current_user = Depends(get_current_user)):
    """Return the profile of the logged‑in user."""
    return UserRead.model_validate(current_user)

@router.get("/", response_model=List[UserRead])
async def list_users(db: AsyncSession = Depends(get_async_session), _: None = Depends(require_role(RoleName.system_admin))):
    """Admin‑only endpoint that lists all users."""
    result = await db.execute(user_crud.select_all_users())
    users = result.scalars().all()
    return [UserRead.model_validate(u) for u in users]

