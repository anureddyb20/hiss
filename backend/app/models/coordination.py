"""Coordination request ORM model.

Represents a structured request for inter‑bureau consultation.
"""

import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, DateTime, Date, Enum, ForeignKey

from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from ..db.base import Base
import enum

class CoordinationStatus(str, enum.Enum):
    draft = "draft"
    submitted = "submitted"
    awaiting_response = "awaiting_response"
    response_received = "response_received"
    completed = "completed"
    cancelled = "cancelled"

class CoordinationRequest(Base):
    __tablename__ = "coordination_requests"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # List of involved case IDs – stored as JSON for simplicity
    case_ids = Column(JSONB, default=list, nullable=False)
    requesting_bureau = Column(String, nullable=False)
    receiving_bureau = Column(String, nullable=False)
    purpose = Column(String, nullable=False)
    evidence = Column(JSONB, default=list)
    coordinator_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    deadline = Column(Date, nullable=True)
    status = Column(Enum(CoordinationStatus), default=CoordinationStatus.draft, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    decision = Column(String, nullable=True)
    decision_notes = Column(String, nullable=True)

    coordinator = relationship("User")
