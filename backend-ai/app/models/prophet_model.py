"""
app/models/prophet_model.py
============================
Prophet time-series forecaster wrapper.
Loads the pre-trained .joblib model on first access (singleton via lru_cache)
and exposes a predict() method used by ForecastService.

The model was trained with:
  - yearly_seasonality=False, daily_seasonality=False
  - add_country_holidays('ID')
  - add_regressor('is_weekend')
"""

import functools
import os

import joblib
import pandas as pd

from app.core.config import settings


@functools.lru_cache(maxsize=1)
def _load_prophet_model():
    """
    Load the Prophet model from disk exactly once and cache it in memory.
    lru_cache(maxsize=1) acts as a lightweight singleton — the model is
    deserialised once per process and reused for all subsequent requests,
    keeping inference latency well under the 2.5 s NFR-6 target.
    """
    path = os.path.abspath(settings.PROPHET_MODEL_PATH)
    if not os.path.exists(path):
        raise FileNotFoundError(
            f"[ProphetForecaster] Model file not found at '{path}'. "
            "Ensure SaveBite_Prophet_Final.joblib is present in backend-ai/."
        )
    model = joblib.load(path)
    print(f"[ProphetForecaster] ✅ Model loaded from '{path}'")
    return model


class ProphetForecaster:
    """
    Thin wrapper around the pre-trained Facebook Prophet model.

    Usage:
        forecaster = ProphetForecaster()
        future_df  = forecaster.make_future_df(history_df, periods=7)
        yhat_df    = forecaster.predict(future_df)   # returns DataFrame
    """

    def __init__(self):
        # Load (or retrieve cached) model on instantiation
        self.model = _load_prophet_model()

    def make_future_df(self, history_df: pd.DataFrame, periods: int = 7) -> pd.DataFrame:
        """
        Build a future DataFrame for the next `periods` days.

        Prophet.make_future_dataframe() extends the training dates, but since
        we are doing inference only (not re-training), we build the future
        window manually using the last known date in history_df.

        Required columns on history_df: 'ds' (datetime), 'is_weekend' (int 0/1).
        The returned DataFrame contains the same columns so the regressor
        'is_weekend' added during training is satisfied.
        """
        last_date = pd.to_datetime(history_df["ds"].max())
        future_dates = pd.date_range(
            start=last_date + pd.Timedelta(days=1), periods=periods, freq="D"
        )
        future_df = pd.DataFrame({"ds": future_dates})
        future_df["is_weekend"] = future_df["ds"].dt.dayofweek.isin([5, 6]).astype(int)
        return future_df

    def predict(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Run inference on `df` (must have 'ds' and 'is_weekend' columns).
        Returns the full Prophet forecast DataFrame with columns including
        'yhat', 'yhat_lower', 'yhat_upper'.
        """
        return self.model.predict(df)
