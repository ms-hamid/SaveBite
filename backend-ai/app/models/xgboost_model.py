"""
app/models/xgboost_model.py
============================
XGBoost residual corrector — the second stage of the ensemble pipeline.

The model was trained to predict the residual error of Prophet using:
    features = ['day_of_week', 'is_weekend', 'rain_intensity', 'promo_aktif']

It corrects Prophet's baseline by adding the predicted residual back:
    final_pred = clip(prophet_yhat + xgb_residual, 0, produksi_harian)
"""

import functools
import os

import joblib
import numpy as np
import pandas as pd

from app.core.config import settings


@functools.lru_cache(maxsize=1)
def _load_xgboost_model():
    """
    Load the XGBoost model from disk exactly once and cache it in memory.
    """
    path = os.path.abspath(settings.XGBOOST_MODEL_PATH)
    if not os.path.exists(path):
        raise FileNotFoundError(
            f"[XGBoostForecaster] Model file not found at '{path}'. "
            "Ensure SaveBite_XGBoost_Final.joblib is present in backend-ai/."
        )
    model = joblib.load(path)
    print(f"[XGBoostForecaster] ✅ Model loaded from '{path}'")
    return model


# Feature columns must exactly match the order used during training
FEATURE_COLS = ["day_of_week", "is_weekend", "rain_intensity", "promo_aktif"]

# Default MVP values for future-projection covariates (no live weather/promo API yet)
DEFAULT_RAIN_INTENSITY = 0   # 0 = sunny / cerah
DEFAULT_PROMO_AKTIF    = 0   # 0 = no active promotion


class XGBoostForecaster:
    """
    Thin wrapper around the pre-trained XGBoost residual corrector.

    Usage:
        corrector = XGBoostForecaster()
        feature_df = corrector.build_feature_df(future_dates_df)
        residuals  = corrector.predict(feature_df)   # returns np.ndarray
    """

    def __init__(self):
        self.model = _load_xgboost_model()

    def build_feature_df(self, dates_df: pd.DataFrame) -> pd.DataFrame:
        """
        Construct the feature matrix for a DataFrame of future dates.

        `dates_df` must have a 'ds' (datetime) column.
        Returns a DataFrame with exactly FEATURE_COLS, ready for predict().

        For MVP: rain_intensity and promo_aktif default to 0 (approved by client).
        """
        X = pd.DataFrame()
        X["day_of_week"]    = dates_df["ds"].dt.dayofweek.astype(int)
        X["is_weekend"]     = dates_df["ds"].dt.dayofweek.isin([5, 6]).astype(int)
        X["rain_intensity"] = DEFAULT_RAIN_INTENSITY
        X["promo_aktif"]    = DEFAULT_PROMO_AKTIF
        return X[FEATURE_COLS]

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        """
        Predict residual corrections for feature matrix X.
        Returns a numpy array of floats (one residual per row).
        """
        return self.model.predict(X)
