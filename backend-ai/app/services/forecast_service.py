"""
app/services/forecast_service.py
=================================
Orchestrates the two-stage forecasting pipeline:
  1. Prophet  — captures seasonality & trend from historical surplus data
  2. XGBoost  — refines residuals using external covariates (weather, events)

The ensemble output is a T+1 daily surplus curve with confidence intervals.
"""

from app.schemas.forecast import ForecastRequest, ForecastResponse
from app.models.prophet_model import ProphetForecaster
from app.models.xgboost_model import XGBoostForecaster


class ForecastService:
    def __init__(self):
        self.prophet = ProphetForecaster()
        self.xgboost = XGBoostForecaster()

    async def predict(self, payload: ForecastRequest) -> ForecastResponse:
        """
        Run the ensemble pipeline and return forecast results.
        TODO: implement pipeline logic.
        """
        raise NotImplementedError
