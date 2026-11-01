"""CRUD operations for User model.

Provides helper functions used by authentication and permission checks.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, Select
from typing import Optional
from ..models.user import User
from ..security.auth import verify_password, hash_password

async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

async def select_all_users() -> Select:
    """Return a selectable that yields all User rows.
    Used by admin list endpoint.
    """
    return select(User)

async def create_user(db: AsyncSession, *, email: str, password: str, full_name: Optional[str] = None, role_id) -> User:
    hashed = hash_password(password)
    user = User(email=email, hashed_password=hashed, full_name=full_name, role_id=role_id)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[User]:
    user = await get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
