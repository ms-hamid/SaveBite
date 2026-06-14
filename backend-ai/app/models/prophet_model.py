"""
app/models/prophet_model.py
============================
Prophet time-series forecaster wrapper.
Encapsulates model training, serialisation (joblib), and inference.

Prophet is used as the primary trend/seasonality model.
Serialised models are cached to MODEL_CACHE_DIR for reuse.
"""

# from prophet import Prophet
# import pandas as pd
# import joblib
# import os
# from app.core.config import settings


class ProphetForecaster:
    """
    Trains a Facebook Prophet model on historical surplus data and
    generates a T+1 daily forecast with uncertainty intervals.
    """

    def __init__(self):
        self.model = None  # TODO: initialise Prophet()

    def train(self, df):
        """
        Train the Prophet model.
        df must have columns: ds (date), y (quantity).
        """
        # TODO: implement training
        raise NotImplementedError

    def predict(self, periods: int = 1):
        """Generate forecast for `periods` future days."""
        # TODO: implement prediction
        raise NotImplementedError

    def save(self, path: str):
        """Serialise the trained model to disk."""
        # TODO: joblib.dump(self.model, path)
        raise NotImplementedError

    def load(self, path: str):
        """Load a previously serialised model from disk."""
        # TODO: self.model = joblib.load(path)
        raise NotImplementedError
