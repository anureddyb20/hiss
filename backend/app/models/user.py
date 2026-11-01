"""User and Role ORM models.

- `User` stores authentication credentials and basic profile data.
- `Role` defines a static set of application roles.

Both use UUID primary keys for security and easier data merging.
"""

import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..db.base import Base
import enum

class RoleName(str, enum.Enum):
    system_admin = "system_admin"
    bureau_officer = "bureau_officer"
    reviewing_officer = "reviewing_officer"
    coordination_officer = "coordination_officer"
    management_viewer = "management_viewer"

class Role(Base):
    __tablename__ = "roles"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Enum(RoleName), unique=True, nullable=False)

    # Back‑ref to users
    users = relationship("User", back_populates="role")

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id"), nullable=False)

    role = relationship("Role", back_populates="users")
