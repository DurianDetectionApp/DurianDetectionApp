import os
import librosa
import soundfile as sf
import numpy as np

INPUT_DIR = "data/processed/ripe"

TARGET_SR = 22050


def add_noise(y):

    noise = np.random.randn(len(y))

    return y + 0.003 * noise


def volume_change(y):

    factor = np.random.uniform(0.9, 1.1)

    return y * factor


def time_shift(y):

    shift = int(0.05 * len(y))

    return np.roll(y, shift)


def augment_audio(file_path, file_name):

    y, sr = librosa.load(
        file_path,
        sr=TARGET_SR
    )

    augmentations = {
        "noise": add_noise(y),
        "volume": volume_change(y),
        "shift": time_shift(y)
    }

    for aug_name, aug_audio in augmentations.items():

        output_name = f"{file_name[:-4]}_{aug_name}.wav"

        output_path = os.path.join(
            INPUT_DIR,
            output_name
        )

        sf.write(
            output_path,
            aug_audio,
            TARGET_SR
        )

        print(f"Saved: {output_name}")


if __name__ == "__main__":

    for file_name in os.listdir(INPUT_DIR):

        if file_name.endswith(".wav"):

            path = os.path.join(
                INPUT_DIR,
                file_name
            )

            augment_audio(
                path,
                file_name
            )