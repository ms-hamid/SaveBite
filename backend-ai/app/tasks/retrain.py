"""
app/tasks/retrain.py
====================
Background task: periodically retrains the Prophet/XGBoost models
with the latest sales data fetched from backend-core.

Triggered by: APScheduler cron  (or Celery beat in production).
Schedule: Daily at 02:00 WIB (UTC+7).
"""

# from apscheduler.schedulers.asyncio import AsyncIOScheduler
# from app.services.forecast_service import ForecastService


async def retrain_all_merchants():
    """
    Fetch all active merchants from backend-core, pull their latest
    sales data, and re-fit the forecasting models.

    TODO: implement full retraining pipeline.
    """
    raise NotImplementedError
