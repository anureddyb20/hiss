"""Overlap candidate and review ORM models.

`Overlap` holds the detection result of a potential relationship between two cases.
Human review updates the record with a decision.
"""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Enum, ForeignKey, Boolean

from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from ..db.base import Base
import enum

class ReviewStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    rejected = "rejected"
    more_info = "more_info"

class Overlap(Base):
    __tablename__ = "overlaps"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_a_id = Column(UUID(as_uuid=True), ForeignKey("cases.id"), nullable=False)
    case_b_id = Column(UUID(as_uuid=True), ForeignKey("cases.id"), nullable=False)
    # Scores for each dimension (0‑1 range)
    institution_score = Column(JSONB, default=dict)  # e.g., {"match": true, "confidence": 0.92}
    complaint_score = Column(JSONB, default=dict)
    action_conflict_score = Column(JSONB, default=dict)
    overall_score = Column(JSONB, default=dict)  # e.g., {"value": 0.78, "threshold": 0.7}
    evidence = Column(JSONB, default=list)  # list of strings describing evidence
    detection_timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    # Review fields
    review_status = Column(Enum(ReviewStatus), default=ReviewStatus.pending, nullable=False)
    reviewer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    review_timestamp = Column(DateTime, nullable=True)
    review_notes = Column(String, nullable=True)

    case_a = relationship("Case", foreign_keys=[case_a_id])
    case_b = relationship("Case", foreign_keys=[case_b_id])
    reviewer = relationship("User")
