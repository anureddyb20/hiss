"""Case ORM model.

Defines the core complaint/issue record used throughout the system.
"""

import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Text, DateTime, Date, Enum, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from ..db.base import Base
import enum

class CaseStatus(str, enum.Enum):
    new = "new"
    open = "open"
    pending = "pending"
    resolved = "resolved"
    closed = "closed"
    cancelled = "cancelled"

class CasePriority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"

class Case(Base):
    __tablename__ = "cases"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_number = Column(String, unique=True, nullable=False)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id"), nullable=False)
    source_system = Column(String, nullable=True)
    bureau = Column(String, nullable=True)
    category = Column(String, nullable=True)
    subject = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    priority = Column(Enum(CasePriority), default=CasePriority.medium, nullable=False)
    status = Column(Enum(CaseStatus), default=CaseStatus.new, nullable=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    due_date = Column(Date, nullable=True)
    resolution_date = Column(Date, nullable=True)
    # Attachments metadata – freeform JSON
    attachments = Column(JSONB, default=dict)

    institution = relationship("Institution", back_populates="cases")
    owner = relationship("User", backref="owned_cases")
    # Placeholder for actions/history – later tables will reference case_id
