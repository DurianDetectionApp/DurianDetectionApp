from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import joblib
import numpy as np
from pathlib import Path
import sys
import uvicorn
import tempfile
import os

# Ensure `src` is on sys.path so we can import `predict.py`
BASE = Path(__file__).resolve().parents[1]
SRC_PATH = str(BASE / "src")
if SRC_PATH not in sys.path:
    sys.path.insert(0, SRC_PATH)

from predict import extract_features

# Optional API key enforcement: set INFERENCE_API_KEY env var to require requests to include it
INFERENCE_API_KEY = os.getenv("INFERENCE_API_KEY")

app = FastAPI(title="Durly Inference API")

MODEL_PATH = BASE / "models" / "random_forest.pkl"

try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    model = None


@app.on_event("startup")
async def startup_event():
    global model
    if model is None:
        model = joblib.load(MODEL_PATH)


@app.post("/infer")
async def infer(request: Request):
    # Accept raw binary body (backend will POST audio bytes with correct content-type)
    # Authorization (if configured)
    if INFERENCE_API_KEY:
        # Accept either 'x-api-key' header or 'Authorization: Bearer <key>'
        hdr = request.headers.get("x-api-key")
        if not hdr:
            auth = request.headers.get("authorization") or ""
            if auth.lower().startswith("bearer "):
                hdr = auth.split(" ", 1)[1].strip()
        if not hdr or hdr != INFERENCE_API_KEY:
            raise HTTPException(status_code=401, detail="Unauthorized")

    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    try:
        body = await request.body()
        if not body:
            raise HTTPException(status_code=400, detail="Empty body")

        # write to temp file
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            tmp.write(body)
            tmp_path = tmp.name

        X = extract_features(tmp_path)
        probs = model.predict_proba(X)[0]
        pred = str(model.predict(X)[0])
        confidence = float(np.max(probs))

        payload = {
            "label": pred,
            "confidence": confidence,
            "probabilities": {str(c): float(p) for c, p in zip(model.classes_, probs)},
        }

        return JSONResponse(content=payload)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/healthz")
async def healthz():
    return JSONResponse(content={"status": "ok", "model_loaded": model is not None})


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
