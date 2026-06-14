"""
app/core/config.py
==================
Centralised settings loaded from environment variables via pydantic-settings.
All sensitive values (DB URL, secret key) must be set in .env.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    ENVIRONMENT: str = "development"
    DATABASE_URL: str = "postgresql+asyncpg://user:pass@localhost:5432/savebite"
    BACKEND_CORE_URL: str = "http://localhost:4000"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]
    MODEL_CACHE_DIR: str = "./data/processed"


settings = Settings()
