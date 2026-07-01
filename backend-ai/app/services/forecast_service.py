"""
app/services/forecast_service.py
=================================
Orchestrates the Two-Stage Stacking forecasting pipeline for T+1 to T+7.

Provides:
- estimated_surplus_today
- peak_demand
- best_publish_time
- confidence_percentage
- recommended_production_reduction
- chart_data (7 days)
Matches PRD FR-AI-01 through FR-AI-04.
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta

from app.models.prophet_model import ProphetForecaster
from app.models.xgboost_model import XGBoostForecaster
from app.schemas.forecast import (
    ForecastData,
    ForecastRequest,
    ForecastResponse,
)

# ── Confidence band ────────────────────────────────────────────────────────────
_CONFIDENCE_MIN = 75
_CONFIDENCE_MAX = 95

# ── Day-of-week fallback peak windows ─────────────────────────────────────────
_DOW_PEAK_FALLBACK = {
    0: ("11:30 - 13:00 & 18:00 - 20:00", "17:30"),
    1: ("11:30 - 13:00 & 18:00 - 20:00", "17:30"),
    2: ("11:30 - 13:00 & 18:00 - 20:00", "17:30"),
    3: ("11:30 - 13:00 & 18:00 - 20:30", "17:30"),
    4: ("12:00 - 13:30 & 18:00 - 21:00", "17:30"),  # Friday
    5: ("11:00 - 14:00 & 17:30 - 21:00", "17:00"),  # Saturday
    6: ("11:00 - 14:00 & 17:00 - 20:30", "16:30"),  # Sunday
}


# ── Helpers ────────────────────────────────────────────────────────────────────

def _parse_time_str(time_str: str) -> datetime | None:
    if not time_str:
        return None
    clean = time_str.split(".")[0].strip()
    for fmt in ("%H:%M:%S", "%H:%M"):
        try:
            return datetime.strptime(clean, fmt)
        except ValueError:
            continue
    return None


def _derive_operational_hints(
    pickup_open: str | None,
    pickup_close: str | None,
    t1_date: pd.Timestamp,
) -> tuple[str, str]:
    open_dt  = _parse_time_str(pickup_open)
    close_dt = _parse_time_str(pickup_close)

    if open_dt and close_dt:
        open_fmt  = open_dt.strftime("%H:%M")
        close_fmt = close_dt.strftime("%H:%M")
        peak_demand = f"{open_fmt} - {close_fmt}"
        publish_dt   = open_dt - timedelta(minutes=30)
        best_publish = publish_dt.strftime("%H:%M")
        return peak_demand, best_publish

    dow = t1_date.dayofweek
    return _DOW_PEAK_FALLBACK[dow]


def _derive_confidence(history_rows) -> int:
    rates = [r.sell_through_rate for r in history_rows if r.sell_through_rate is not None]
    if len(rates) >= 3:
        arr  = np.array(rates, dtype=float)
        mean = arr.mean()
        std  = arr.std()
        if mean > 0:
            cv = std / mean
            score = _CONFIDENCE_MAX - int(cv * (_CONFIDENCE_MAX - _CONFIDENCE_MIN) * 2)
            return int(np.clip(score, _CONFIDENCE_MIN, _CONFIDENCE_MAX))

    sold = np.array([r.quantity_sold for r in history_rows], dtype=float)
    mean = sold.mean()
    if mean == 0 or len(sold) < 3:
        return _CONFIDENCE_MIN
    cv    = sold.std() / mean
    score = _CONFIDENCE_MAX - int(cv * (_CONFIDENCE_MAX - _CONFIDENCE_MIN) * 2)
    return int(np.clip(score, _CONFIDENCE_MIN, _CONFIDENCE_MAX))


# ── Service ────────────────────────────────────────────────────────────────────

class ForecastService:
    def __init__(self):
        self.prophet = ProphetForecaster()
        self.xgboost = XGBoostForecaster()

    def predict(self, payload: ForecastRequest) -> ForecastResponse:
        default_prod = payload.production_qty

        # 1. History DataFrame (Not strictly required for Prophet inference in our pipeline,
        #    but we parse it for completeness and future-proofing)
        history_df = pd.DataFrame([
            {
                "ds":           point.date,
                "quantity_sold": point.quantity_sold,
            }
            for point in payload.history
        ])
        history_df["ds"] = pd.to_datetime(history_df["ds"])
        history_df["is_weekend"] = history_df["ds"].dt.dayofweek.isin([5, 6]).astype(int)
        history_df = history_df.sort_values("ds").reset_index(drop=True)

        # 2. Build explicit 1-day future window starting from target_date
        target_ds = pd.to_datetime(payload.target_date)
        future_df = pd.DataFrame({"ds": [target_ds]})
        future_df["is_weekend"] = future_df["ds"].dt.dayofweek.isin([5, 6]).astype(int)

        # 3. Prophet baseline
        prophet_result = self.prophet.predict(future_df)
        yhat = prophet_result["yhat"].values

        # 4 & 5. XGBoost feature matrix & residual correction
        X_future  = self.xgboost.build_feature_df(future_df)
        residuals = self.xgboost.predict(X_future)

        # 6. Final T+1 to T+7 predictions
        final_preds = np.clip(yhat + residuals, 0, default_prod).astype(int)
        estimated_surplus_today = int(final_preds[0])

        # 7. Derive KPI values from Merchant operating hours
        peak_demand, best_publish_time = _derive_operational_hints(
            pickup_open=payload.pickup_open,
            pickup_close=payload.pickup_close,
            t1_date=target_ds,
        )

        # 8. Dynamic confidence
        confidence = _derive_confidence(payload.history)

        # 9. Build response
        data = ForecastData(
            estimated_surplus_today=estimated_surplus_today,
            peak_demand=peak_demand,
            best_publish_time=best_publish_time,
            confidence_percentage=confidence,
        )

        return ForecastResponse(
            status="success",
            data=data,
        )
