import os
import librosa
import numpy as np
import pandas as pd

DATA_DIR = "data/segmented"

OUTPUT_CSV = "data/features/features.csv"

TARGET_SR = 22050


def extract_features(file_path):

    try:

        y, sr = librosa.load(
            file_path,
            sr=TARGET_SR
        )

        # skip empty audio
        if len(y) == 0:
            return None

        features = []

        rms = np.mean(
            librosa.feature.rms(y=y)
        )

        zcr = np.mean(
            librosa.feature.zero_crossing_rate(y)
        )

        centroid = np.mean(
            librosa.feature.spectral_centroid(
                y=y,
                sr=sr
            )
        )

        bandwidth = np.mean(
            librosa.feature.spectral_bandwidth(
                y=y,
                sr=sr
            )
        )

        rolloff = np.mean(
            librosa.feature.spectral_rolloff(
                y=y,
                sr=sr
            )
        )

        mfcc = librosa.feature.mfcc(
            y=y,
            sr=sr,
            n_mfcc=13
        )

        mfcc_mean = np.mean(
            mfcc,
            axis=1
        )

        features.extend([
            rms,
            zcr,
            centroid,
            bandwidth,
            rolloff
        ])

        features.extend(mfcc_mean)

        # remove NaN
        if np.isnan(features).any():
            return None

        return features

    except Exception as e:

        print(f"Error processing {file_path}")

        return None


data = []

labels = ["ripe", "unripe"]

for label in labels:

    folder = os.path.join(
        DATA_DIR,
        label
    )

    for file_name in os.listdir(folder):

        if file_name.endswith(".wav"):

            path = os.path.join(
                folder,
                file_name
            )

            features = extract_features(path)

            if features is not None:

                features.append(label)

                data.append(features)

                print(f"Extracted: {file_name}")


columns = [
    "rms",
    "zcr",
    "centroid",
    "bandwidth",
    "rolloff"
]

columns += [f"mfcc_{i}" for i in range(13)]

columns.append("label")

df = pd.DataFrame(
    data,
    columns=columns
)

print(df.head()) 

df.to_csv(
    OUTPUT_CSV,
    index=False
)

print("\nFeature extraction completed.")