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
    BACKEND_CORE_URL: str = "http://localhost:5000"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5000"]
    MODEL_CACHE_DIR: str = "./data/processed"

    # ── ML model file paths ───────────────────────────────────────────────────
    # Relative paths are resolved from the working directory (backend-ai/).
    PROPHET_MODEL_PATH: str = "./SaveBite_Prophet_Final.joblib"
    XGBOOST_MODEL_PATH: str = "./SaveBite_XGBoost_Final.joblib"


settings = Settings()
