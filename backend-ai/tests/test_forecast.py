"""
tests/test_forecast.py
=======================
Integration tests for the /api/v1/forecast/predict endpoint.
"""

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


# TODO: add forecast prediction tests once service is implemented
# def test_predict_returns_forecast():
#     payload = { "merchant_id": "...", "history": [...] }
#     response = client.post("/api/v1/forecast/predict", json=payload)
#     assert response.status_code == 200
