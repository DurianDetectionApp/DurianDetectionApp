import os
import librosa
import soundfile as sf
import numpy as np
from scipy.signal import find_peaks

# =========================
# PATHS
# =========================

RAW_DATA_DIR = "data/raw"

OUTPUT_DIR = "data/segmented"

CLASSES = ["ripe", "unripe"]

# =========================
# PARAMETERS
# =========================

SAMPLE_RATE = 22050

# minimum silence between taps
MIN_DISTANCE = 8000

# peak threshold
PEAK_THRESHOLD = 0.25

# duration before peak
PRE_OFFSET = 0.15

# duration after peak
POST_OFFSET = 0.35

# =========================
# CREATE OUTPUT FOLDERS
# =========================

for cls in CLASSES:
    os.makedirs(
        os.path.join(OUTPUT_DIR, cls),
        exist_ok=True
    )

# =========================
# PROCESS FILES
# =========================

for cls in CLASSES:

    input_folder = os.path.join(
        RAW_DATA_DIR,
        cls
    )

    output_folder = os.path.join(
        OUTPUT_DIR,
        cls
    )

    files = os.listdir(input_folder)

    for file_name in files:

        if not file_name.endswith(".wav"):
            continue

        file_path = os.path.join(
            input_folder,
            file_name
        )

        print(f"\nProcessing: {file_name}")

        try:

            # =========================
            # LOAD AUDIO
            # =========================

            y, sr = librosa.load(
                file_path,
                sr=SAMPLE_RATE
            )

            # =========================
            # NORMALIZE
            # =========================

            y = librosa.util.normalize(y)

            # =========================
            # FIND PEAKS
            # =========================

            peaks, _ = find_peaks(
                np.abs(y),
                height=PEAK_THRESHOLD,
                distance=MIN_DISTANCE
            )

            print(f"Detected taps: {len(peaks)}")

            # =========================
            # EXTRACT EACH TAP
            # =========================

            for i, peak in enumerate(peaks):

                start = int(
                    peak - PRE_OFFSET * sr
                )

                end = int(
                    peak + POST_OFFSET * sr
                )

                start = max(start, 0)
                end = min(end, len(y))

                segment = y[start:end]

                # skip weak segments
                if np.max(np.abs(segment)) < 0.1:
                    continue

                output_name = (
                    f"{file_name[:-4]}_tap_{i}.wav"
                )

                output_path = os.path.join(
                    output_folder,
                    output_name
                )

                sf.write(
                    output_path,
                    segment,
                    sr
                )

            print("Done.")

        except Exception as e:

            print(f"Error: {e}")

print("\nAll segmentation completed.")