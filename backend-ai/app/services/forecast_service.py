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
import joblib
import os

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

    def retrain_and_compare(self, history_df: pd.DataFrame) -> dict:
        """
        Retrain models from fresh data and compare with current models.
        If new models are better (lower WAPE), switch to them.
        If not, keep current models.

        This is called automatically when new training data is uploaded.

        Args:
            history_df: DataFrame with columns: ds, y, day_of_week, is_weekend,
                       rain_intensity, promo_aktif (+ optional other features)

        Returns:
            dict with keys:
                - "status": "success" or "error"
                - "current_wape": WAPE of current model on test set
                - "new_wape": WAPE of retrained model on test set
                - "metrics": full metrics dict for new model
                - "switched": boolean, whether new model was adopted
        """
        try:
            from prophet import Prophet
            import xgboost as xgb
            from sklearn.metrics import mean_absolute_error, mean_squared_error
            import joblib
            import os
            import shutil
        except ImportError as exc:
            raise RuntimeError(f"ML library not available: {exc}")

        if len(history_df) < 14:
            raise ValueError(f"At least 14 rows required, got {len(history_df)}")

        # ── 1. Split: 80% train, 20% test (chronological) ─────────────────
        n = len(history_df)
        split = int(n * 0.80)
        df_train = history_df.iloc[:split].copy()
        df_test = history_df.iloc[split:].copy()

        # ── 2. Train new models ──────────────────────────────────────────
        new_prophet = Prophet(yearly_seasonality=False, daily_seasonality=False)
        new_prophet.add_country_holidays(country_name="ID")
        new_prophet.add_regressor("is_weekend")
        new_prophet.fit(df_train[["ds", "y", "is_weekend"]])

        df_train["prophet_pred"] = new_prophet.predict(df_train[["ds", "is_weekend"]])["yhat"].values
        df_train["residual"] = df_train["y"] - df_train["prophet_pred"]

        features = ["day_of_week", "is_weekend", "rain_intensity", "promo_aktif"]
        new_xgb = xgb.XGBRegressor(
            n_estimators=100, learning_rate=0.08, max_depth=4, random_state=42
        )
        new_xgb.fit(df_train[features], df_train["residual"])

        # ── 3. Evaluate new models on test set ────────────────────────────
        prophet_test_pred = new_prophet.predict(df_test[["ds", "is_weekend"]])["yhat"].values
        xgb_residuals = new_xgb.predict(df_test[features])
        new_final_preds = np.clip(
            prophet_test_pred + xgb_residuals, 0, df_test["production_qty"].values
        )
        new_actuals = df_test["y"].values

        new_mae = float(mean_absolute_error(new_actuals, new_final_preds))
        new_rmse = float(np.sqrt(mean_squared_error(new_actuals, new_final_preds)))
        new_wape = float(
            (np.sum(np.abs(new_actuals - new_final_preds)) / max(np.sum(new_actuals), 1)) * 100
        )

        new_metrics = {
            "mae": new_mae,
            "rmse": new_rmse,
            "wape": new_wape,
            "rows_used": n,
            "train_rows": split,
            "test_rows": n - split,
        }

        # ── 4. Evaluate current models on same test set ───────────────────
        try:
            from app.models.prophet_model import _load_prophet_model
            from app.models.xgboost_model import _load_xgboost_model

            current_prophet = _load_prophet_model()
            current_xgb = _load_xgboost_model()

            current_prophet_pred = current_prophet.predict(df_test[["ds", "is_weekend"]])["yhat"].values
            current_xgb_residuals = current_xgb.predict(df_test[features])
            current_final_preds = np.clip(
                current_prophet_pred + current_xgb_residuals, 0, df_test["production_qty"].values
            )

            current_wape = float(
                (np.sum(np.abs(new_actuals - current_final_preds)) / max(np.sum(new_actuals), 1)) * 100
            )
        except Exception as e:
            print(f"[ForecastService] Could not evaluate current model: {e}")
            current_wape = 999.0  # Treat as "no current model"

        # ── 5. Compare and decide ────────────────────────────────────────
        switched = False
        if new_wape < current_wape:
            # New model is better — save it
            from app.core.config import settings
            prophet_path = os.path.abspath(settings.PROPHET_MODEL_PATH)
            xgb_path = os.path.abspath(settings.XGBOOST_MODEL_PATH)

            ts = datetime.now().strftime("%Y%m%d_%H%M%S")
            if os.path.exists(prophet_path):
                shutil.copy2(prophet_path, prophet_path.replace(".joblib", f"_backup_{ts}.joblib"))
            if os.path.exists(xgb_path):
                shutil.copy2(xgb_path, xgb_path.replace(".joblib", f"_backup_{ts}.joblib"))

            joblib.dump(new_prophet, prophet_path)
            joblib.dump(new_xgb, xgb_path)

            # Clear cache
            from app.models.prophet_model import _load_prophet_model
            from app.models.xgboost_model import _load_xgboost_model
            _load_prophet_model.cache_clear()
            _load_xgboost_model.cache_clear()

            switched = True
            print(f"[ForecastService] ✅ New model adopted: WAPE={new_wape:.2f}% (was {current_wape:.2f}%)")
        else:
            print(f"[ForecastService] ℹ️  Current model retained: WAPE={current_wape:.2f}% vs new {new_wape:.2f}%")

        return {
            "status": "success",
            "current_wape": round(current_wape, 2),
            "new_wape": round(new_wape, 2),
            "metrics": new_metrics,
            "switched": switched,
        }
