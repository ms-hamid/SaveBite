"""
backend-ai — SaveBite AI Forecasting Service
=============================================
FastAPI application entry-point.

Mounts all API routers and configures global middleware (CORS, logging).
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import health, forecast

app = FastAPI(
    title="SaveBite AI Service",
    description="Time-series surplus forecasting using Prophet & XGBoost",
    version="0.1.0",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
)

# ── CORS ──────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────
app.include_router(health.router, tags=["Health"])
app.include_router(forecast.router, prefix="/api/v1/forecast", tags=["Forecast"])
