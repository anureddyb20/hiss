"""Pydantic schemas for User model.
"""

from typing import Optional
from uuid import UUID
from pydantic import BaseModel

class UserRead(BaseModel):
    id: UUID
    email: str
    full_name: Optional[str] = None
    is_active: bool
    role: str

    class Config:
        from_attributes = True
