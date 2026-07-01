# STEP 3 — Testing Guide: AI Forecast Pipeline

## Quick-Start: Boot Both Servers

### Terminal 1 — Python FastAPI (backend-ai) via Docker
We run the AI service in Docker (Python 3.11) to ensure the heavy C++ data science binaries (Prophet/XGBoost) compile correctly, especially if your host machine is on Python 3.13.

```powershell
# Run from the monorepo root
cd c:\Hamid\Project\SaveBite

# Build and start the container (first time will take ~5 mins to build)
docker compose up --build
```

✅ You should see the container start, load the models, and expose port 8000:
```
savebite-backend-ai  | [ProphetForecaster] ✅ Model loaded from './SaveBite_Prophet_Final.joblib'
savebite-backend-ai  | [XGBoostForecaster] ✅ Model loaded from './SaveBite_XGBoost_Final.joblib'
savebite-backend-ai  | INFO:     Uvicorn running on http://0.0.0.0:8000
```

> [!NOTE]
> Swagger UI is now available at **http://localhost:8000/docs** (dev mode enabled).

---

### Terminal 2 — Node.js Express (backend-core)
The Node.js proxy runs locally on your host as normal.
```powershell
# Run from root
cd c:\Hamid\Project\SaveBite
npm run dev   # or: cd backend-core && npm run dev
```

---

## Test A — Python FastAPI Direct (Postman)

**Method:** `POST`  
**URL:** `http://localhost:8000/api/v1/forecast/predict`  
**Headers:** `Content-Type: application/json`

**Body (raw JSON — enriched with `pickup_open`, `target_date`, and full history):**
```json
{
  "merchant_id": "test-merchant-abc-123",
  "production_qty": 150,
  "target_date": "2026-07-01",
  "pickup_open": "17:00:00",
  "pickup_close": "21:00:00",
  "history": [
    {
      "date": "2026-06-25",
      "quantity_sold": 87,
      "actual_surplus": 63,
      "production_qty": 150,
      "rain_intensity": 0,
      "promo_active": false,
      "sell_through_rate": 0.58,
      "surplus_rate": 0.42
    },
    {
      "date": "2026-06-26",
      "quantity_sold": 105,
      "actual_surplus": 45,
      "production_qty": 150,
      "rain_intensity": 0,
      "promo_active": false,
      "sell_through_rate": 0.7,
      "surplus_rate": 0.3
    },
    {
      "date": "2026-06-27",
      "quantity_sold": 78,
      "actual_surplus": 72,
      "production_qty": 150,
      "rain_intensity": 1,
      "promo_active": false,
      "sell_through_rate": 0.52,
      "surplus_rate": 0.48
    },
    {
      "date": "2026-06-28",
      "quantity_sold": 98,
      "actual_surplus": 52,
      "production_qty": 150,
      "rain_intensity": 0,
      "promo_active": false,
      "sell_through_rate": 0.6533,
      "surplus_rate": 0.3467
    },
    {
      "date": "2026-06-29",
      "quantity_sold": 115,
      "actual_surplus": 35,
      "production_qty": 150,
      "rain_intensity": 0,
      "promo_active": true,
      "sell_through_rate": 0.7667,
      "surplus_rate": 0.2333
    },
    {
      "date": "2026-06-30",
      "quantity_sold": 90,
      "actual_surplus": 60,
      "production_qty": 150,
      "rain_intensity": 0,
      "promo_active": false,
      "sell_through_rate": 0.6,
      "surplus_rate": 0.4
    },
    {
      "date": "2026-07-01",
      "quantity_sold": 107,
      "actual_surplus": 43,
      "production_qty": 150,
      "rain_intensity": 0,
      "promo_active": false,
      "sell_through_rate": 0.7133,
      "surplus_rate": 0.2867
    }
  ]
}
```

**Expected Response (HTTP 200):**
```json
{
  "status": "success",
  "data": {
    "estimated_surplus_today": 39,
    "peak_demand": "17:00 - 21:00",
    "best_publish_time": "16:30",
    "confidence_percentage": 90
  }
}
```

> [!NOTE]
> `peak_demand` is derived directly from `pickup_open` and `pickup_close`. `best_publish_time` is exactly 30 minutes before `pickup_open`. `confidence_percentage` is calculated dynamically based on the variance of `sell_through_rate` in the history array. `estimated_surplus_today` strictly forecasts for the explicitly provided `target_date`.

---

## Test B — Node.js Proxy via Browser (Dev Bypass)

Open this URL directly in your browser:

```
http://localhost:5000/api/merchant/foresight?bypass=dev_secret
```

This will:
1. Skip JWT authentication (`devBypassOrAuthenticate` detects `bypass=dev_secret`).
2. Query Prisma for `Merchant.pickup_open` / `Merchant.pickup_close`.
3. Query Prisma for `ai_feature_history` (if sparse for dev, falls back to rich synthetic demo data containing all fields).
4. Auto-inject `target_date` as "Today" in `Asia/Jakarta` timezone.
5. POST the enriched payload to Python FastAPI.
6. Return the AI JSON verbatim.

**Expected Response (same structure as Test A):**
```json
{
  "status": "success",
  "data": {
    "estimated_surplus_today": 38,
    "peak_demand": "17:00 - 21:00",
    "best_publish_time": "16:30",
    "confidence_percentage": 90
  }
}
```

> [!TIP]
> To test with a specific merchant's real data from your DB, append `&merchant_id=<uuid>`:
> ```
> http://localhost:5000/api/merchant/foresight?bypass=dev_secret&merchant_id=your-merchant-uuid-here
> ```

---

## If the AI is Unavailable (Test C — Fallback)

Stop the Python container (`Ctrl+C` in Terminal 1, or `docker compose down`), then hit the Node.js proxy:
```
http://localhost:5000/api/merchant/foresight?bypass=dev_secret
```

You should get **HTTP 502** with the graceful fallback matching the exact 4-field card schema:
```json
{
  "status": "fallback",
  "fallback_reason": "AI service unreachable: fetch failed",
  "data": {
    "estimated_surplus_today": null,
    "peak_demand": null,
    "best_publish_time": null,
    "confidence_percentage": null
  }
}
```

---

## Troubleshooting

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| `ModuleNotFoundError: No module named 'prophet'` | Python running locally on Python 3.13 | Always use `docker compose up` to start the AI server |
| `503 AI model not available` | `.joblib` files missing from image | Ensure files are in `backend-ai` root and rebuild: `docker compose build backend-ai` |
| `422 Unprocessable Entity` | `history` has < 7 items | Add more rows to the Postman body |
| Browser shows `{"error":"Route not found"}` | Wrong URL | URL must be `/api/merchant/foresight` (plural `foresight`) |
| `AbortError` / timeout in Node.js logs | Docker container not running | Start Docker compose in Terminal 1 first |

---

## Files Written — Summary

| File | Status | Role |
|------|--------|------|
| [backend-ai/.env](file:///c:/Hamid/Project/SaveBite/backend-ai/.env) | ✅ Modified | Dev mode + CORS + model paths |
| [app/core/config.py](file:///c:/Hamid/Project/SaveBite/backend-ai/app/core/config.py) | ✅ Modified | Added `PROPHET_MODEL_PATH`, `XGBOOST_MODEL_PATH` settings |
| [app/models/prophet_model.py](file:///c:/Hamid/Project/SaveBite/backend-ai/app/models/prophet_model.py) | ✅ Implemented | Singleton loader + `make_future_df()` + `predict()` |
| [app/models/xgboost_model.py](file:///c:/Hamid/Project/SaveBite/backend-ai/app/models/xgboost_model.py) | ✅ Implemented | Singleton loader + `build_feature_df()` + `predict()` |
| [app/schemas/forecast.py](file:///c:/Hamid/Project/SaveBite/backend-ai/app/schemas/forecast.py) | ✅ Replaced | Exact UI JSON contract (4 metric fields), explicitly accepts `target_date` |
| [app/services/forecast_service.py](file:///c:/Hamid/Project/SaveBite/backend-ai/app/services/forecast_service.py) | ✅ Rewritten | Data-driven KPIs using DB operating hours + dynamic confidence, strictly targets "Today" |
| [app/routers/forecast.py](file:///c:/Hamid/Project/SaveBite/backend-ai/app/routers/forecast.py) | ✅ Rewritten | Lazy initialization of singleton to prevent import crashes |
| [backend-core/src/routes/merchant/foresight.route.js](file:///c:/Hamid/Project/SaveBite/backend-core/src/routes/merchant/foresight.route.js) | ✅ Rewritten | Injects `target_date` (Jakarta time), proxies `pickup_open`/`close` and full `ai_feature_history` |
| [backend-core/src/index.js](file:///c:/Hamid/Project/SaveBite/backend-core/src/index.js) | ✅ Modified | Mounted `/api/merchant/foresight` |
| [Dockerfile](file:///c:/Hamid/Project/SaveBite/backend-ai/Dockerfile) | ✅ Rewritten | Copies models and sets Python 3.11 environment |
| [docker-compose.yml](file:///c:/Hamid/Project/SaveBite/docker-compose.yml) | ✅ Modified | Set environment paths for models and container networking |
| [PRD_Savebite.md](file:///c:/Hamid/Project/SaveBite/PRD_Savebite.md) | ✅ Updated | PRD aligned with final UI metric card designs and API requirements |
