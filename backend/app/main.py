"""FastAPI application entry point.

Provides:
- CORS configuration (allow origins from env or default localhost).
- Health check endpoint.
- Inclusion of API routers under /api/v1.
- Dependency injection for DB session.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .db.session import async_engine, async_session_factory
from .api import v1_router

app = FastAPI(title="SYNAPSE Backend", version="0.1.0")

# CORS – only allow the development frontend URL by default
origins = [settings.frontend_origin]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["monitoring"])  # simple health probe
async def health_check() -> dict:
    return {"status": "ok"}

# Include API routers under /api/v1
app.include_router(v1_router, prefix="/api/v1")
