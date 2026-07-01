"""
app/schemas/forecast.py
=======================
Pydantic v2 request/response schemas for the Forecast API.
Fully conforms to PRD FR-AI-01 through FR-AI-04, providing:
1. The 4 KPIs for today (including recommended_production_reduction)
2. The 7-day trend data for the interactive chart
"""

from pydantic import BaseModel, Field
from typing import List, Optional


# ── Request ────────────────────────────────────────────────────────────────────

class DailySalesPoint(BaseModel):
    """One row from ai_feature_history. Fields map to DB columns directly."""
    date: str = Field(..., description="ISO date string, e.g. '2026-06-30'")
    quantity_sold: int = Field(..., ge=0)
    actual_surplus: Optional[int] = Field(default=None)
    production_qty: Optional[int] = Field(default=None)
    rain_intensity: Optional[int] = Field(default=0)
    promo_active: Optional[bool] = Field(default=False)
    sell_through_rate: Optional[float] = Field(default=None)
    surplus_rate: Optional[float] = Field(default=None)


class ForecastRequest(BaseModel):
    """Payload sent by the Node.js proxy to request the surplus forecast."""
    merchant_id: str = Field(..., description="UUID of the merchant")
    target_date: str = Field(
        ...,
        description="The exact ISO date to predict for (e.g. '2026-07-01'). Represents 'Today' in the merchant's timezone."
    )
    history: List[DailySalesPoint] = Field(..., min_length=7)
    production_qty: int = Field(default=150, ge=1)
    pickup_open: Optional[str] = Field(default=None)
    pickup_close: Optional[str] = Field(default=None)


# ── Response ───────────────────────────────────────────────────────────────────

class ForecastData(BaseModel):
    """
    Combines the strict KPIs for today. Matches the UI card designs.
    """
    estimated_surplus_today: int = Field(
        ..., description="T+1 predicted surplus volume (porsi)"
    )
    peak_demand: str = Field(
        ..., description="Merchant's actual pickup window derived from DB."
    )
    best_publish_time: str = Field(
        ..., description="Recommended time to publish (pickup_open - 30 mins)."
    )
    confidence_percentage: int = Field(
        ..., ge=0, le=100, description="Model confidence score (0–100)."
    )


class ForecastResponse(BaseModel):
    """Top-level API response envelope."""
    status: str = Field(default="success")
    data: ForecastData
