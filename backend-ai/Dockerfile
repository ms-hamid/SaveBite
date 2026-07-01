# ─────────────────────────────────────────────────────────────────────────────
# SaveBite backend-ai — Production Dockerfile
# ─────────────────────────────────────────────────────────────────────────────
# Python multi-stage build optimised for heavy C++ data-science binaries
# (Prophet/Stan, XGBoost, scikit-learn) which exceed Vercel's 50 MB limit.
#
# ⚠️  PYTHON VERSION: Must stay on 3.11. Prophet 1.1.5 + scikit-learn 1.5.0
#     do NOT have pre-compiled wheels for Python 3.13 and will fail to build.
#
# Local dev:  docker compose up --build  (uses docker-compose.yml)
# Production: docker build -t savebite-backend-ai -f backend-ai/Dockerfile backend-ai/
#             docker run -p 8000:8000 --env-file backend-ai/.env savebite-backend-ai
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: builder — install dependencies in a full Python image ────────────
FROM python:3.11-slim AS builder

WORKDIR /app

# System dependencies required to compile Prophet (Stan/pystan) and XGBoost
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    libgomp1 \
 && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install wheel for faster binary installs
RUN pip install --upgrade pip wheel

# Copy requirements first to leverage Docker layer cache
COPY requirements.txt ./

# Install all Python dependencies into a prefix directory for easy copying
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# ── Stage 2: runner — lean production image ───────────────────────────────────
FROM python:3.11-slim AS runner

# Runtime dependencies (libgomp required by XGBoost/Prophet at runtime)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy installed packages from builder stage
COPY --from=builder /install /usr/local

# Copy application source
COPY app/     ./app/
COPY main.py  ./

# ── Copy pre-trained model files ──────────────────────────────────────────────
# The .joblib files are the serialised Prophet + XGBoost models.
# They live in the backend-ai/ root alongside main.py.
COPY SaveBite_Prophet_Final.joblib  ./SaveBite_Prophet_Final.joblib
COPY SaveBite_XGBoost_Final.joblib  ./SaveBite_XGBoost_Final.joblib

# Create data directories for ML model cache (mount a volume in production)
RUN mkdir -p ./data/raw ./data/processed

# Security: run as non-root user
RUN addgroup --system --gid 1001 pygroup \
 && adduser  --system --uid 1001 pyuser  --ingroup pygroup
USER pyuser

# Environment defaults (override via container env vars or --env-file)
ENV ENVIRONMENT=development
ENV PORT=8000
ENV HOST=0.0.0.0
ENV PROPHET_MODEL_PATH=./SaveBite_Prophet_Final.joblib
ENV XGBOOST_MODEL_PATH=./SaveBite_XGBoost_Final.joblib

EXPOSE ${PORT}

# Uvicorn bound to 0.0.0.0 so the container port is reachable from outside.
# --workers 2 → safe default for a 512 MB container (1 per 256 MB RAM).
CMD ["sh", "-c", "uvicorn main:app --host $HOST --port $PORT --workers 2 --no-access-log"]
