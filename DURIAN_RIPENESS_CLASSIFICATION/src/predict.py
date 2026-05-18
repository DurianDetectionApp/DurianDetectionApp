import json
import sys
from pathlib import Path

import joblib
import librosa
import numpy as np

TARGET_SR = 22050
MODEL_PATH = Path(__file__).resolve().parents[1] / 'models' / 'random_forest.pkl'


def extract_features(file_path: str):
    y, sr = librosa.load(file_path, sr=TARGET_SR, mono=True)

    if len(y) == 0:
        raise ValueError('Empty audio file')

    features = []

    rms = np.mean(librosa.feature.rms(y=y))
    zcr = np.mean(librosa.feature.zero_crossing_rate(y))
    centroid = np.mean(librosa.feature.spectral_centroid(y=y, sr=sr))
    bandwidth = np.mean(librosa.feature.spectral_bandwidth(y=y, sr=sr))
    rolloff = np.mean(librosa.feature.spectral_rolloff(y=y, sr=sr))

    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    mfcc_mean = np.mean(mfcc, axis=1)

    features.extend([rms, zcr, centroid, bandwidth, rolloff])
    features.extend(mfcc_mean.tolist())

    if np.isnan(features).any():
        raise ValueError('Audio feature extraction produced NaN values')

    return np.array(features, dtype=float).reshape(1, -1)


def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'Missing audio file path'}))
        sys.exit(1)

    audio_path = sys.argv[1]
    model = joblib.load(MODEL_PATH)
    features = extract_features(audio_path)

    label = str(model.predict(features)[0])
    probabilities = model.predict_proba(features)[0]
    confidence = float(np.max(probabilities))

    payload = {
        'label': label,
        'confidence': confidence,
        'probabilities': {
            str(cls): float(prob)
            for cls, prob in zip(model.classes_, probabilities)
        },
    }

    print(json.dumps(payload))


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        print(json.dumps({'error': str(exc)}))
        sys.exit(1)