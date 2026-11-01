"""Database engine and session management (async).

Provides:
- `async_engine` – SQLAlchemy AsyncEngine based on DATABASE_URL.
- `async_session_factory` – sessionmaker for AsyncSession.
- FastAPI dependency `get_async_session` to inject a session per request.
"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from ..config import settings

# Create async engine; future=True is default for SQLAlchemy 2
async_engine = create_async_engine(settings.database_url, echo=False, future=True)

# AsyncSession factory – expire_on_commit=False for better performance
async_session_factory = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Dependency for FastAPI routes
async def get_async_session() -> AsyncSession:
    async with async_session_factory() as session:
        yield session
