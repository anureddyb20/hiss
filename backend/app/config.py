"""Application configuration using pydantic BaseSettings.

Environment variables (with defaults for dev):
- DATABASE_URL – PostgreSQL async URL
- JWT_SECRET – secret key for JWT signing
- JWT_ALGORITHM – JWT algorithm (HS256)
- JWT_ACCESS_TOKEN_EXPIRE_MINUTES – default 30
- JWT_REFRESH_TOKEN_EXPIRE_DAYS – default 7
- FRONTEND_ORIGIN – URL of the frontend (e.g., http://localhost:5173)
"""

from pydantic import Field
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = Field(env="DATABASE_URL", default="postgresql+asyncpg://synapse:synapse_password@db:5432/synapse")
    jwt_secret: str = Field(env="JWT_SECRET", default="super-secret-key-please-change")
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30
    jwt_refresh_token_expire_days: int = 7
    frontend_origin: str = Field(env="FRONTEND_ORIGIN", default="http://localhost:5173")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
