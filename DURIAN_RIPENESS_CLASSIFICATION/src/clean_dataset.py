import os
import librosa
import numpy as np

# =========================
# PATHS
# =========================

INPUT_DIR = "data/segmented"

CLASSES = ["ripe", "unripe"]

# =========================
# THRESHOLDS
# =========================

MIN_DURATION = 0.1
MAX_DURATION = 1.0

MIN_RMS = 0.01

CLIPPING_THRESHOLD = 0.99

# =========================
# PROCESS
# =========================

for cls in CLASSES:

    folder = os.path.join(
        INPUT_DIR,
        cls
    )

    files = os.listdir(folder)

    for file_name in files:

        if not file_name.endswith(".wav"):
            continue

        file_path = os.path.join(
            folder,
            file_name
        )

        try:

            y, sr = librosa.load(
                file_path,
                sr=22050
            )

            duration = librosa.get_duration(
                y=y,
                sr=sr
            )

            rms = np.mean(
                librosa.feature.rms(
                    y=y
                )
            )

            peak = np.max(np.abs(y))

            remove = False

            # =========================
            # TOO SHORT
            # =========================

            if duration < MIN_DURATION:
                remove = True

            # =========================
            # TOO LONG
            # =========================

            if duration > MAX_DURATION:
                remove = True

            # =========================
            # TOO QUIET
            # =========================

            if rms < MIN_RMS:
                remove = True

            # =========================
            # CLIPPING
            # =========================

            if peak >= CLIPPING_THRESHOLD:
                remove = True

            # =========================
            # DELETE
            # =========================

            if remove:

                os.remove(file_path)

                print(f"Removed: {file_name}")

        except Exception as e:

            print(f"Error: {file_name}")

print("\nDataset cleaning completed.")