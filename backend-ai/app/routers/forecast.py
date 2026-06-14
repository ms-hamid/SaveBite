"""
app/routers/forecast.py
=======================
Forecast router — exposes the T+1 surplus prediction endpoint consumed by
the Merchant AI Foresight Dashboard in the frontend.

Routes:
  POST /api/v1/forecast/predict   → run Prophet/XGBoost forecast for a merchant
  GET  /api/v1/forecast/{merchant_id}/history → return historical forecast data
"""

from fastapi import APIRouter, Depends
from app.schemas.forecast import ForecastRequest, ForecastResponse
from app.services.forecast_service import ForecastService

router = APIRouter()


@router.post("/predict", response_model=ForecastResponse, summary="Run surplus forecast")
async def predict_surplus(
    payload: ForecastRequest,
    service: ForecastService = Depends(ForecastService),
):
    """
    Accepts historical sales data for a merchant and returns a T+1 surplus
    volume prediction curve produced by the ensemble (Prophet + XGBoost).
    """
    # TODO: implement
    raise NotImplementedError


@router.get("/{merchant_id}/history", summary="Get forecast history for a merchant")
async def get_forecast_history(merchant_id: str):
    # TODO: implement
    raise NotImplementedError
