from fastapi import FastAPI, UploadFile, File, HTTPException
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
async def infer(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    # save uploaded file to temp and reuse existing extract_features
    try:
        contents = await file.read()
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            tmp.write(contents)
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
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
