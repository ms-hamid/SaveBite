"""
tests/test_health.py
=====================
Tests for the /health endpoint (backend-ai FastAPI service).

FR Coverage:
  FR-AI-02 / FR-AI-03 — Verifies the AI service is reachable (health probe)

Mocking guardrail:
  TestClient is used (in-process ASGI transport — no real network calls).
  No ProphetForecaster / XGBoostForecaster models are loaded.
"""

import pytest
from fastapi.testclient import TestClient
import sys
import os

# Ensure the backend-ai root is on path for `from main import app`
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from main import app

client = TestClient(app)


class TestHealthEndpoint:
    """GET /health — liveness probe (FR-AI service reachability)."""

    def test_health_returns_200(self):
        response = client.get("/health")
        assert response.status_code == 200

    def test_health_returns_ok_status(self):
        response = client.get("/health")
        data = response.json()
        assert data["status"] == "ok"

    def test_health_returns_service_name(self):
        response = client.get("/health")
        data = response.json()
        assert data["service"] == "backend-ai"

    def test_health_response_is_json(self):
        response = client.get("/health")
        assert "application/json" in response.headers["content-type"]
