"""
app/routers/forecast.py
=======================
Forecast router — exposes the T+1–T+7 surplus prediction endpoint
consumed by the Merchant AI Foresight Dashboard.

Routes:
  POST /api/v1/forecast/predict   → run Prophet/XGBoost ensemble forecast
  POST /api/v1/forecast/retrain   → retrain models with uploaded Excel data

Design note — lazy service instantiation:
  ForecastService is instantiated INSIDE the route handler the first time
  a request arrives (not at module import time). This prevents the server
  from crashing on startup when prophet/scikit-learn are not installed in
  the local Python environment (e.g. Python 3.13 on Windows).
  In production (Docker / Python 3.11) the models load on the first request
  and are then cached via lru_cache for all subsequent calls.
"""

import io
import os
import functools
import tempfile
import shutil
from datetime import datetime, timedelta

import asyncpg
import joblib
import numpy as np
import pandas as pd
from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse

from app.schemas.forecast import ForecastRequest, ForecastResponse
from app.services.forecast_service import ForecastService
from app.core.config import settings

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


# ── Retraining endpoint ────────────────────────────────────────────────────────

# Required columns in the uploaded Excel file
_REQUIRED_COLS = {"ds", "y", "rain_intensity", "promo_aktif", "produksi_harian"}
_FEATURE_COLS  = ["day_of_week", "is_weekend", "rain_intensity", "promo_aktif"]


def _validate_and_prepare(df: pd.DataFrame) -> pd.DataFrame:
    """
    Validate the uploaded DataFrame and derive computed columns.
    Raises ValueError with a human-readable message on any issue.
    """
    missing = _REQUIRED_COLS - set(df.columns)
    if missing:
        raise ValueError(
            f"Missing required columns: {', '.join(sorted(missing))}. "
            f"Required: ds, y, rain_intensity, promo_aktif, produksi_harian"
        )

    df = df.copy()
    df["ds"] = pd.to_datetime(df["ds"], errors="coerce")

    bad_dates = df["ds"].isna().sum()
    if bad_dates > 0:
        raise ValueError(f"{bad_dates} row(s) have unparseable 'ds' dates. Use YYYY-MM-DD format.")

    # Cast numerics and coerce bad values
    for col in ["y", "rain_intensity", "promo_aktif", "produksi_harian"]:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0).astype(int)

    # Validate ranges
    if (df["y"] < 0).any():
        raise ValueError("Column 'y' (surplus) must be >= 0.")
    if not df["rain_intensity"].isin([0, 1, 2]).all():
        raise ValueError("Column 'rain_intensity' must be 0 (sunny), 1 (drizzle), or 2 (heavy rain).")
    if not df["promo_aktif"].isin([0, 1]).all():
        raise ValueError("Column 'promo_aktif' must be 0 (inactive) or 1 (active).")
    if (df["produksi_harian"] <= 0).any():
        raise ValueError("Column 'produksi_harian' must be > 0.")

    if len(df) < 14:
        raise ValueError(f"At least 14 rows are required for retraining. Got {len(df)}.")

    # Derive calendar features
    df["day_of_week"] = df["ds"].dt.dayofweek.astype(int)
    df["is_weekend"]  = df["ds"].dt.dayofweek.isin([5, 6]).astype(int)
    df = df.sort_values("ds").reset_index(drop=True)

    return df


def _retrain_models(df: pd.DataFrame) -> dict:
    """
    Retrain Prophet + XGBoost on `df` and overwrite the .joblib files.
    Returns a dict of evaluation metrics.
    
    CRITICAL: Prophet models with Stan backend cannot be reliably pickled after predictions.
    Solution: Save Prophet model IMMEDIATELY after fit(), before invoking any predictions.
    This preserves the Stan backend state while it's still valid in memory.
    """
    import shutil

    # Lazy import so the server doesn't crash if prophet isn't installed
    try:
        from prophet import Prophet
        import xgboost as xgb
        from sklearn.metrics import mean_absolute_error, mean_squared_error
    except ImportError as exc:
        raise RuntimeError(f"ML library not available: {exc}")

    # ── Chronological 80/20 split ──────────────────────────────────────────────
    n = len(df)
    split = int(n * 0.80)
    df_train = df.iloc[:split].copy()
    df_test  = df.iloc[split:].copy()

    # ── Stage 1: Prophet ───────────────────────────────────────────────────────
    prophet_model = Prophet(yearly_seasonality=False, daily_seasonality=False)
    prophet_model.add_country_holidays(country_name="ID")
    prophet_model.add_regressor("is_weekend")
    prophet_model.fit(df_train[["ds", "y", "is_weekend"]])
    
    # ── SAVE PROPHET IMMEDIATELY (while Stan backend is valid) ──────────────────
    prophet_path = os.path.abspath(settings.PROPHET_MODEL_PATH)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    if os.path.exists(prophet_path):
        shutil.copy2(prophet_path, prophet_path.replace(".joblib", f"_backup_{ts}.joblib"))
    
    try:
        joblib.dump(prophet_model, prophet_path)
    except Exception as e:
        print(f"[_retrain_models] ⚠️  Prophet save failed (Stan backend issue): {e}")
        raise RuntimeError(
            f"Failed to serialize Prophet model. "
            f"This usually means the Stan backend is invalid. Error: {e}"
        )

    # ── Residual computation + Stage 2: XGBoost ──────────────────────────────
    df_train["prophet_pred"] = prophet_model.predict(df_train[["ds", "is_weekend"]])["yhat"].values
    df_train["residual"]     = df_train["y"] - df_train["prophet_pred"]

    xgb_model = xgb.XGBRegressor(
        n_estimators=100, learning_rate=0.08, max_depth=4, random_state=42
    )
    xgb_model.fit(df_train[_FEATURE_COLS], df_train["residual"])

    # ── Save XGBoost ──────────────────────────────────────────────────────────
    xgb_path = os.path.abspath(settings.XGBOOST_MODEL_PATH)
    if os.path.exists(xgb_path):
        shutil.copy2(xgb_path, xgb_path.replace(".joblib", f"_backup_{ts}.joblib"))
    joblib.dump(xgb_model, xgb_path)

    # ── Evaluate on test split ─────────────────────────────────────────────────
    prophet_test_pred = prophet_model.predict(df_test[["ds", "is_weekend"]])["yhat"].values
    xgb_residuals     = xgb_model.predict(df_test[_FEATURE_COLS])
    final_preds       = np.clip(
        prophet_test_pred + xgb_residuals, 0, df_test["produksi_harian"].values
    )
    actuals = df_test["y"].values

    mae  = float(mean_absolute_error(actuals, final_preds))
    rmse = float(np.sqrt(mean_squared_error(actuals, final_preds)))
    wape = float(
        (np.sum(np.abs(actuals - final_preds)) / max(np.sum(actuals), 1)) * 100
    )

    # ── Invalidate lru_cache so next /predict loads the fresh model ───────────
    from app.models.prophet_model import _load_prophet_model
    from app.models.xgboost_model import _load_xgboost_model
    _load_prophet_model.cache_clear()
    _load_xgboost_model.cache_clear()

    # Force the service singleton to be reconstructed on next request
    global _service
    _service = None

    print(f"[_retrain_models] ✅ Models retrained — MAE={mae:.2f} RMSE={rmse:.2f} WAPE={wape:.2f}%")

    return {
        "rows_used":   n,
        "train_rows":  split,
        "test_rows":   n - split,
        "mae_porsi":   round(mae, 2),
        "rmse_porsi":  round(rmse, 2),
        "wape_pct":    round(wape, 2),
        "retrained_at": datetime.now().isoformat(),
    }

    return {
        "rows_used":   n,
        "train_rows":  split,
        "test_rows":   n - split,
        "mae_porsi":   round(mae, 2),
        "rmse_porsi":  round(rmse, 2),
        "wape_pct":    round(wape, 2),
        "retrained_at": datetime.now().isoformat(),
    }


@router.post(
    "/retrain",
    summary="Retrain Prophet + XGBoost models from uploaded Excel/CSV",
    response_description="Retraining metrics (MAE, RMSE, WAPE) and row counts",
)
async def retrain_from_upload(file: UploadFile = File(...)):
    """
    Accepts an Excel (.xlsx / .xls) or CSV file with historical sales data,
    retrains both the Prophet and XGBoost models, overwrites the .joblib files,
    and returns evaluation metrics.

    **Required columns in the file:**

    | Column            | Type    | Description                            |
    |-------------------|---------|----------------------------------------|
    | `ds`              | date    | Date in YYYY-MM-DD format              |
    | `y`               | int     | Actual food surplus (porsi)            |
    | `rain_intensity`  | int     | 0 = sunny, 1 = drizzle, 2 = heavy rain |
    | `promo_aktif`     | int     | 0 = no promo, 1 = promo active         |
    | `produksi_harian` | int     | Daily production capacity (porsi)      |

    Minimum 14 rows required. The endpoint automatically derives
    `day_of_week` and `is_weekend` from the `ds` column.
    """
    # ── Validate file type ────────────────────────────────────────────────────
    filename = file.filename or ""
    if not any(filename.lower().endswith(ext) for ext in (".xlsx", ".xls", ".csv")):
        raise HTTPException(
            status_code=400,
            detail="Only .xlsx, .xls, or .csv files are accepted.",
        )

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:  # 10 MB guard
        raise HTTPException(status_code=413, detail="File exceeds 10 MB limit.")

    # ── Parse file ────────────────────────────────────────────────────────────
    try:
        if filename.lower().endswith(".csv"):
            df_raw = pd.read_csv(io.BytesIO(contents))
        else:
            df_raw = pd.read_excel(io.BytesIO(contents))
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Could not parse file: {exc}")

    # ── Validate & prepare ────────────────────────────────────────────────────
    try:
        df = _validate_and_prepare(df_raw)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    # ── Retrain ───────────────────────────────────────────────────────────────
    try:
        metrics = _retrain_models(df)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        print(f"[RetrainRouter] ❌ Retraining failed: {exc}")
        raise HTTPException(status_code=500, detail=f"Retraining failed: {str(exc)}")

    return JSONResponse(
        status_code=200,
        content={
            "status":  "success",
            "message": "Models retrained successfully. New predictions will use the updated models.",
            "metrics": metrics,
        },
    )


@router.post(
    "/retrain-pipeline",
    summary="Trigger the database-driven retraining pipeline",
)
async def trigger_retrain_pipeline():
    """
    Runs the automated daily retraining pipeline using data from `ai_feature_history`
    within a 2-year sliding window, compares with current production model performance,
    promotes the best if new model is better, and returns comparison metrics.
    
    This endpoint now uses the ForecastService.retrain_and_compare() method which
    provides automatic model comparison and intelligent promotion based on WAPE.
    """
    import asyncpg
    from datetime import datetime, timedelta
    
    try:
        # ── 1. Fetch data from database ───────────────────────────────────────
        db_url = settings.DATABASE_URL
        if "+asyncpg" in db_url:
            db_url = db_url.replace("+asyncpg", "")
        
        conn = await asyncpg.connect(db_url)
        two_years_ago = (datetime.utcnow() - timedelta(days=730)).date()

        rows = await conn.fetch("""
            SELECT feature_date, actual_surplus, production_qty,
                   day_of_week, is_weekend, rain_intensity, promo_active
            FROM public.ai_feature_history
            WHERE feature_date >= $1
            ORDER BY feature_date ASC
        """, two_years_ago)
        
        await conn.close()

        if len(rows) < 14:
            raise ValueError(
                f"Insufficient data: {len(rows)} rows (minimum 14 required)."
            )

        # ── 2. Build DataFrame ────────────────────────────────────────────────
        df = pd.DataFrame([dict(r) for r in rows])
        df = df.rename(columns={
            "feature_date": "ds",
            "actual_surplus": "y",
            "production_qty": "production_qty",
            "promo_active": "promo_aktif",
        })
        df["ds"] = pd.to_datetime(df["ds"])
        df["is_weekend"] = df["is_weekend"].fillna(False).astype(int)
        df["promo_aktif"] = df["promo_aktif"].fillna(False).astype(int)
        df["rain_intensity"] = df["rain_intensity"].fillna(0).astype(int)
        df["production_qty"] = df["production_qty"].fillna(150).astype(int)
        df["y"] = df["y"].fillna(0).astype(int)
        df["day_of_week"] = df["day_of_week"].astype(int)
        df = df.sort_values("ds").reset_index(drop=True)

        # ── 3. Use ForecastService.retrain_and_compare() ──────────────────────
        service = _get_service()
        result = service.retrain_and_compare(df)

        # ── 4. Log to database (optional) ──────────────────────────────────────
        try:
            conn = await asyncpg.connect(db_url)
            await conn.execute("""
                INSERT INTO public.ai_training_log (
                    started_at, finished_at, records_used,
                    mae, rmse, mape,
                    candidate_score, production_score,
                    model_promoted, status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            """,
                datetime.utcnow(), datetime.utcnow(), result['metrics']['rows_used'],
                float(result['metrics']['mae']), float(result['metrics']['rmse']), 
                float(result['metrics']['wape']),
                float(result['new_wape']), float(result['current_wape']),
                result['switched'], result['status'],
            )
            await conn.close()
        except Exception as log_err:
            print(f"[RetrainPipeline] Failed to write log to DB: {log_err}")

        # ── 5. Return result ───────────────────────────────────────────────────
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "message": f"Retraining completed. Model {'promoted' if result['switched'] else 'retained'}.",
                "data": {
                    "rows_used": result['metrics']['rows_used'],
                    "train_rows": result['metrics']['train_rows'],
                    "test_rows": result['metrics']['test_rows'],
                    "current_wape": result['current_wape'],
                    "new_wape": result['new_wape'],
                    "mae": result['metrics']['mae'],
                    "rmse": result['metrics']['rmse'],
                    "model_promoted": result['switched'],
                    "comparison": {
                        "current_model_wape": result['current_wape'],
                        "new_model_wape": result['new_wape'],
                        "improvement": round(result['current_wape'] - result['new_wape'], 2) if result['switched'] else 0,
                    }
                }
            }
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc)
        )
    except Exception as exc:
        print(f"[RetrainPipeline] ❌ Pipeline failure: {exc}")
        raise HTTPException(
            status_code=500,
            detail=f"Retraining pipeline failed: {str(exc)}"
        )

