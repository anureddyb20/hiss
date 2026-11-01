"""SQLAlchemy declarative base for all ORM models.

The declarative base is created without a bind – the engine is injected
when creating sessions.
"""

from sqlalchemy.orm import declarative_base

Base = declarative_base()
