"""
app/routers/health.py
=====================
Health-check endpoint — used by Docker / load balancers to verify liveness.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health", summary="Health check")
def health_check():
    return {"status": "ok", "service": "backend-ai"}
