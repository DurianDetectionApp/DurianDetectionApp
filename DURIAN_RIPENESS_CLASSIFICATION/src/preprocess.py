import os
import librosa
import soundfile as sf

RAW_DIR = "data/segmented"
PROCESSED_DIR = "data/processed"

TARGET_SR = 22050


def preprocess_audio(input_path, output_path):

    y, sr = librosa.load(
        input_path,
        sr=TARGET_SR,
        mono=True
    )

    # trim silence
    y_trimmed, _ = librosa.effects.trim(
        y,
        top_db=20
    )

    # normalize
    y_normalized = librosa.util.normalize(
        y_trimmed
    )

    sf.write(
        output_path,
        y_normalized,
        TARGET_SR
    )


def process_folder(class_name):

    input_folder = os.path.join(
        RAW_DIR,
        class_name
    )

    output_folder = os.path.join(
        PROCESSED_DIR,
        class_name
    )

    os.makedirs(output_folder, exist_ok=True)

    for file_name in os.listdir(input_folder):

        if file_name.endswith(".wav"):

            input_path = os.path.join(
                input_folder,
                file_name
            )

            output_path = os.path.join(
                output_folder,
                file_name
            )

            preprocess_audio(
                input_path,
                output_path
            )

            print(f"Processed: {file_name}")


if __name__ == "__main__":

    process_folder("ripe")
    process_folder("unripe")