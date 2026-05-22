#!/usr/bin/env bash
set -euo pipefail

# Usage: ./test_predict.sh [API_URL] [AUDIO_FILE]
API_URL=${1:-http://localhost:8080/predict}
FILE=${2:-../frontend/assets/audio-samples/sample.wav}

echo "Posting $FILE to $API_URL"
if [[ -n "${INFERENCE_API_KEY-}" ]]; then
  curl -v -H "x-api-key: ${INFERENCE_API_KEY}" -F "audio=@${FILE}" "${API_URL}"
else
  curl -v -F "audio=@${FILE}" "${API_URL}"
fi
