"""
app/services/retrain_pipeline.py
=================================
Automated daily retraining pipeline for Prophet + XGBoost residual stacking.

Fetches data from `ai_feature_history` (2-year sliding window),
trains candidate models, compares against production, promotes if better,
archives old models, and logs results to `ai_training_log`.

Uses the same .joblib paths as the existing prediction service.
"""

import traceback
import os
import shutil
from datetime import datetime, timedelta

import joblib
import numpy as np
import pandas as pd
import asyncpg

from app.core.config import settings
from app.models.prophet_model import _load_prophet_model
from app.models.xgboost_model import _load_xgboost_model

_FEATURE_COLS = ["day_of_week", "is_weekend", "rain_intensity", "promo_aktif"]


def _get_db_url() -> str:
    """Convert SQLAlchemy-style URL to plain asyncpg URL."""
    url = settings.DATABASE_URL
    if "+asyncpg" in url:
        url = url.replace("+asyncpg", "")
    return url


async def run_retraining_pipeline() -> dict:
    """
    Full retraining pipeline:
    1. Fetch 2-year sliding window from ai_feature_history
    2. 80/20 chronological split
    3. Train candidate Prophet + XGBoost
    4. Evaluate candidate vs production model
    5. Promote if candidate is better (lower MAE or RMSE)
    6. Archive all models, log to ai_training_log
    """
    started_at = datetime.utcnow()
    status = "failed"
    records_used = 0
    mae, rmse, mape = 0.0, 0.0, 0.0
    candidate_score, production_score = 999999.0, 999999.0
    model_promoted = False

    db_url = _get_db_url()
    conn = None


    try:
        conn = await asyncpg.connect(db_url)
        two_years_ago = (started_at - timedelta(days=730)).date()

        # ── 1. Fetch data ─────────────────────────────────────────────────
        rows = await conn.fetch("""
            SELECT feature_date, actual_surplus, production_qty,
                   day_of_week, is_weekend, rain_intensity, promo_active
            FROM public.ai_feature_history
            WHERE feature_date >= $1
            ORDER BY feature_date ASC
        """, two_years_ago)

        records_used = len(rows)
        if records_used < 14:
            raise ValueError(
                f"Insufficient data: {records_used} rows (minimum 14)."
            )

        # ── 2. Build DataFrame ────────────────────────────────────────────
        df = pd.DataFrame([dict(r) for r in rows])
        df = df.rename(columns={
            "feature_date": "ds",
            "actual_surplus": "y",
            "production_qty": "produksi_harian",
            "promo_active": "promo_aktif",
        })
        df["ds"] = pd.to_datetime(df["ds"])
        df["is_weekend"] = df["is_weekend"].fillna(False).astype(int)
        df["promo_aktif"] = df["promo_aktif"].fillna(False).astype(int)
        df["rain_intensity"] = df["rain_intensity"].fillna(0).astype(int)
        df["produksi_harian"] = df["produksi_harian"].fillna(150).astype(int)
        df["y"] = df["y"].fillna(0).astype(int)
        df["day_of_week"] = df["day_of_week"].astype(int)
        df = df.sort_values("ds").reset_index(drop=True)

        # ── 3. Split ──────────────────────────────────────────────────────
        split = int(records_used * 0.80)
        df_train = df.iloc[:split].copy()
        df_test = df.iloc[split:].copy()

        # ── 4. Train candidate models ─────────────────────────────────────
        from prophet import Prophet
        import xgboost as xgb
        from sklearn.metrics import mean_absolute_error, mean_squared_error

        # Prophet
        cand_prophet = Prophet(
            yearly_seasonality=False, daily_seasonality=False
        )
        cand_prophet.add_country_holidays(country_name="ID")
        cand_prophet.add_regressor("is_weekend")
        cand_prophet.fit(df_train[["ds", "y", "is_weekend"]])

        df_train["prophet_pred"] = cand_prophet.predict(
            df_train[["ds", "is_weekend"]]
        )["yhat"].values
        df_train["residual"] = df_train["y"] - df_train["prophet_pred"]

        # XGBoost
        cand_xgb = xgb.XGBRegressor(
            n_estimators=100, learning_rate=0.08, max_depth=4, random_state=42
        )
        cand_xgb.fit(df_train[_FEATURE_COLS], df_train["residual"])

        # ── 5. Evaluate candidate (BEFORE any file I/O) ──────────────────
        cand_prophet_pred = cand_prophet.predict(
            df_test[["ds", "is_weekend"]]
        )["yhat"].values
        cand_xgb_res = cand_xgb.predict(df_test[_FEATURE_COLS])
        cand_preds = np.clip(
            cand_prophet_pred + cand_xgb_res,
            0,
            df_test["produksi_harian"].values,
        )
        actuals = df_test["y"].values

        mae = float(mean_absolute_error(actuals, cand_preds))
        rmse = float(np.sqrt(mean_squared_error(actuals, cand_preds)))
        mape = float(
            np.mean(np.abs((actuals - cand_preds) / np.maximum(actuals, 1)))
            * 100
        )
        candidate_score = mae

        # ── 6. Evaluate current production model ─────────────────────────
        prophet_path = os.path.abspath(settings.PROPHET_MODEL_PATH)
        xgb_path = os.path.abspath(settings.XGBOOST_MODEL_PATH)
        has_production = (
            os.path.exists(prophet_path) and os.path.exists(xgb_path)
        )

        prod_rmse = 999999.0
        if has_production:
            try:
                prod_prophet = joblib.load(prophet_path)
                prod_xgb = joblib.load(xgb_path)

                prod_prophet_pred = prod_prophet.predict(
                    df_test[["ds", "is_weekend"]]
                )["yhat"].values

                X_prod = df_test[_FEATURE_COLS].copy()
                prod_xgb_res = prod_xgb.predict(X_prod)
                prod_preds = np.clip(
                    prod_prophet_pred + prod_xgb_res,
                    0,
                    df_test["produksi_harian"].values,
                )

                prod_mae = float(mean_absolute_error(actuals, prod_preds))
                prod_rmse = float(
                    np.sqrt(mean_squared_error(actuals, prod_preds))
                )
                production_score = prod_mae
            except Exception as e:
                print(
                    f"[RetrainPipeline] Could not evaluate production model: {e}"
                )
                production_score = 999999.0
        else:
            production_score = 999999.0

        # ── 7. Decide promotion ───────────────────────────────────────────
        if (
            not has_production
            or candidate_score < production_score
            or rmse < prod_rmse
        ):
            model_promoted = True

        # ── 8. Archive candidate models ───────────────────────────────────
        archive_dir = os.path.join(os.path.dirname(prophet_path), "archive")
        os.makedirs(archive_dir, exist_ok=True)

        date_tag = started_at.strftime("%Y_%m_%d")
        joblib.dump(
            cand_prophet,
            os.path.join(archive_dir, f"prophet_{date_tag}.joblib"),
        )
        joblib.dump(
            cand_xgb,
            os.path.join(archive_dir, f"xgb_{date_tag}.joblib"),
        )

        # ── 9. Promote to production ──────────────────────────────────────
        if model_promoted:
            # Backup current production files
            if os.path.exists(prophet_path):
                ts = started_at.strftime("%Y%m%d_%H%M%S")
                shutil.copy2(
                    prophet_path,
                    prophet_path.replace(".joblib", f"_backup_{ts}.joblib"),
                )
            if os.path.exists(xgb_path):
                ts = started_at.strftime("%Y%m%d_%H%M%S")
                shutil.copy2(
                    xgb_path,
                    xgb_path.replace(".joblib", f"_backup_{ts}.joblib"),
                )

            # Overwrite production with candidate
            joblib.dump(cand_prophet, prophet_path)
            joblib.dump(cand_xgb, xgb_path)

            # Invalidate lru_cache so next /predict loads fresh model
            _load_prophet_model.cache_clear()
            _load_xgboost_model.cache_clear()

            # Force the service singleton to be reconstructed
            try:
                import sys
                if "app.routers.forecast" in sys.modules:
                    sys.modules["app.routers.forecast"]._service = None
            except Exception:
                pass

            print(
                f"[RetrainPipeline] Model PROMOTED "
                f"(candidate MAE={mae:.2f} vs production MAE={production_score:.2f})"
            )
        else:
            print(
                f"[RetrainPipeline] Model NOT promoted "
                f"(candidate MAE={mae:.2f} vs production MAE={production_score:.2f})"
            )

        status = "success"

    except Exception as exc:
        print(f"[RetrainPipeline] Pipeline failure: {exc}")
        status = "failed"
        traceback.print_exc()
        raise

    finally:
        finished_at = datetime.utcnow()
        if conn:
            try:
                await conn.execute("""
                    INSERT INTO public.ai_training_log (
                        started_at, finished_at, records_used,
                        mae, rmse, mape,
                        candidate_score, production_score,
                        model_promoted, status
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                """,
                    started_at, finished_at, records_used,
                    float(mae), float(rmse), float(mape),
                    float(candidate_score), float(production_score),
                    model_promoted, status,
                )
            except Exception as e:
                print(f"[RetrainPipeline] Failed to write log to DB: {e}")
            await conn.close()

    return {
        "status": status,
        "records_used": records_used,
        "mae": round(mae, 4),
        "rmse": round(rmse, 4),
        "mape": round(mape, 4),
        "candidate_score": round(candidate_score, 4),
        "production_score": round(production_score, 4),
        "model_promoted": model_promoted,
        "started_at": started_at.isoformat(),
        "finished_at": finished_at.isoformat(),
    }
