"""Institution and InstitutionAlias ORM models.

The `Institution` entity represents a single educational institution, and
`InstitutionAlias` stores alternative names or identifiers that can be used
for matching.
"""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Enum, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from ..db.base import Base
import enum

class VerificationStatus(str, enum.Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"

class Institution(Base):
    __tablename__ = "institutions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    official_id = Column(String, nullable=True, unique=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    state = Column(String, nullable=True)
    district = Column(String, nullable=True)
    website = Column(String, nullable=True)
    verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.pending, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    aliases = relationship("InstitutionAlias", back_populates="institution", cascade="all, delete-orphan")
    cases = relationship("Case", back_populates="institution")

class InstitutionAlias(Base):
    __tablename__ = "institution_aliases"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id"), nullable=False)
    alias = Column(String, nullable=False)
    # optional source field (e.g., where alias was found)
    source = Column(String, nullable=True)

    institution = relationship("Institution", back_populates="aliases")
