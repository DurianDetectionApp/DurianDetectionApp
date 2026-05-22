from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import joblib
import numpy as np
from pathlib import Path
from predict import extract_features
import uvicorn
import tempfile

app = FastAPI(title="Durly Inference API")

BASE = Path(__file__).resolve().parents[1]
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


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
