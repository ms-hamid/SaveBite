"""
app/schemas/forecast.py
=======================
Pydantic v2 request/response schemas for the Forecast API.
These act as the contract between the frontend and the AI service.
"""

from pydantic import BaseModel, Field
from typing import List
from datetime import date


class DailySalesPoint(BaseModel):
    """A single historical sales data point."""
    date: date
    quantity_sold: int = Field(..., ge=0, description="Number of items sold on this day")


class ForecastRequest(BaseModel):
    """Payload sent by the Merchant frontend to request a T+1 forecast."""
    merchant_id: str
    history: List[DailySalesPoint] = Field(
        ..., min_length=7, description="At least 7 days of sales history required"
    )


class ForecastPoint(BaseModel):
    """A single predicted data point in the response curve."""
    date: date
    predicted_surplus: float
    lower_bound: float
    upper_bound: float


class ForecastResponse(BaseModel):
    """AI service response containing the T+1 prediction curve."""
    merchant_id: str
    model_used: str = Field(description="'prophet', 'xgboost', or 'ensemble'")
    forecast: List[ForecastPoint]
