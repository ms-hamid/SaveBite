"""
app/routers/forecast.py
=======================
Forecast router — exposes the T+1–T+7 surplus prediction endpoint
consumed by the Merchant AI Foresight Dashboard.

Routes:
  POST /api/v1/forecast/predict   → run Prophet/XGBoost ensemble forecast

Design note — lazy service instantiation:
  ForecastService is instantiated INSIDE the route handler the first time
  a request arrives (not at module import time). This prevents the server
  from crashing on startup when prophet/scikit-learn are not installed in
  the local Python environment (e.g. Python 3.13 on Windows).
  In production (Docker / Python 3.11) the models load on the first request
  and are then cached via lru_cache for all subsequent calls.
"""

from fastapi import APIRouter, HTTPException

from app.schemas.forecast import ForecastRequest, ForecastResponse
from app.services.forecast_service import ForecastService

router = APIRouter()

# Lazily initialised on first request — avoids crashing at import-time when
# prophet is not installed in the local environment (Python 3.13 dev machines).
_service: ForecastService | None = None


def _get_service() -> ForecastService:
    global _service
    if _service is None:
        _service = ForecastService()
    return _service


@router.post(
    "/predict",
    response_model=ForecastResponse,
    summary="Run 7-day surplus forecast (Prophet + XGBoost ensemble)",
    response_description="7-day surplus prediction curve with KPI summary for the Merchant dashboard",
)
async def predict_surplus(payload: ForecastRequest) -> ForecastResponse:
    """
    Accepts historical sales data for a merchant and returns a T+1 → T+7
    surplus volume forecast produced by the Two-Stage Stacking ensemble.

    **Request body:**
    - `merchant_id`    — UUID of the requesting merchant
    - `history`        — at least 7 historical daily sales data points
    - `production_qty` — daily production capacity ceiling (default 150 porsi)

    **Response:**
    ```json
    {
      "status": "success",
      "data": {
        "summary": {
          "estimated_surplus_today": 42,
          "peak_demand": "11:30 - 13:00 & 18:00 - 20:00",
          "best_publish_time": "17:30",
          "confidence_percentage": 88
        },
        "chart_data": [ { "date": "2 Jul", "surplus": 42 }, ... ]
      }
    }
    ```

    **peak_demand** and **best_publish_time** are derived from the day-of-week
    of the T+1 predicted date, reflecting Indonesian F&B UMKM operational patterns.
    **confidence_percentage** is dynamic — derived from the variance of the
    provided history (low variance → higher confidence).
    """
    try:
        return _get_service().predict(payload)
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"AI model not available: {exc}",
        )
    except Exception as exc:
        # Catch-all — log and return 500 so the Node.js proxy triggers its fallback
        print(f"[ForecastRouter] ❌ Unhandled error: {exc}")
        raise HTTPException(
            status_code=500,
            detail=f"Forecast pipeline error: {str(exc)}",
        )
