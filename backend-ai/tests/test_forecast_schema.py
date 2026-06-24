"""
tests/test_forecast_schema.py
==============================
Tests for Pydantic schema validation on the Forecast endpoint.

FR Coverage:
  FR-AI-01 — ForecastRequest schema (data ingestion contract validation)
  FR-AI-02 — ForecastResponse schema structure

Mocking guardrail:
  Uses Pydantic validation in isolation — NO Prophet/XGBoost models loaded.
  TestClient is used for endpoint-level validation tests.
  The forecast router raises NotImplementedError (stub) so we only test
  the HTTP contract / request validation layer.
"""

import pytest
from datetime import date, timedelta
from pydantic import ValidationError

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.schemas.forecast import (
    DailySalesPoint,
    ForecastRequest,
    ForecastResponse,
    ForecastPoint,
)
from fastapi.testclient import TestClient
from main import app

client = TestClient(app, raise_server_exceptions=False)


# ── Helper ────────────────────────────────────────────────────────────────────

def build_history(n_days: int = 7):
    """Build n_days of valid DailySalesPoint data."""
    today = date.today()
    return [
        {"date": str(today - timedelta(days=i)), "quantity_sold": 10 + i}
        for i in range(n_days, 0, -1)
    ]


# ─────────────────────────────────────────────────────────────────────────────


class TestDailySalesPointSchema:
    """FR-AI-01 — DailySalesPoint data-point validation."""

    def test_valid_point_accepted(self):
        point = DailySalesPoint(date=date.today(), quantity_sold=5)
        assert point.quantity_sold == 5

    def test_negative_quantity_rejected(self):
        with pytest.raises(ValidationError):
            DailySalesPoint(date=date.today(), quantity_sold=-1)

    def test_zero_quantity_accepted(self):
        """Edge case: 0 sold is valid (no sales on a day)."""
        point = DailySalesPoint(date=date.today(), quantity_sold=0)
        assert point.quantity_sold == 0


class TestForecastRequestSchema:
    """FR-AI-01 — ForecastRequest contract validation."""

    def test_valid_request_with_7_days(self):
        payload = ForecastRequest(
            merchant_id="merch-uuid-001",
            history=[
                DailySalesPoint(
                    date=date.today() - timedelta(days=i), quantity_sold=10
                )
                for i in range(7, 0, -1)
            ],
        )
        assert payload.merchant_id == "merch-uuid-001"
        assert len(payload.history) == 7

    def test_history_with_less_than_7_days_rejected(self):
        """FR-AI-01: at least 7 days of history required."""
        with pytest.raises(ValidationError):
            ForecastRequest(
                merchant_id="merch-uuid-001",
                history=[
                    {"date": str(date.today()), "quantity_sold": 5}
                ],  # only 1 day
            )

    def test_missing_merchant_id_rejected(self):
        with pytest.raises(ValidationError):
            ForecastRequest(history=build_history(7))  # no merchant_id


class TestForecastEndpointContract:
    """FR-AI-02 — POST /api/v1/forecast/predict HTTP contract tests."""

    def test_predict_endpoint_returns_422_on_empty_payload(self):
        """No body → Pydantic validation error → 422 Unprocessable Entity."""
        response = client.post("/api/v1/forecast/predict", json={})
        assert response.status_code == 422

    def test_predict_endpoint_returns_422_on_insufficient_history(self):
        """Less than 7 days of history → 422."""
        payload = {
            "merchant_id": "merch-uuid-001",
            "history": [
                {"date": str(date.today()), "quantity_sold": 10}
            ],
        }
        response = client.post("/api/v1/forecast/predict", json=payload)
        assert response.status_code == 422

    def test_predict_endpoint_with_valid_schema_hits_service_stub(self):
        """
        Valid schema passes Pydantic but hits the NotImplementedError stub.
        The server should return 500 (or 501) — meaning schema validation passed.
        """
        payload = {
            "merchant_id": "merch-uuid-001",
            "history": build_history(7),
        }
        response = client.post("/api/v1/forecast/predict", json=payload)
        # Schema validated OK, stub raises NotImplementedError → 500
        assert response.status_code in [500, 501]

    def test_history_route_returns_501_for_unimplemented_stub(self):
        """GET /{merchant_id}/history is a stub → should not return 200."""
        response = client.get("/api/v1/forecast/merch-uuid-001/history")
        assert response.status_code in [500, 501]
