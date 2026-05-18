import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import (
    train_test_split,
    cross_val_score
)

from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    classification_report,
    confusion_matrix
)

DATA_PATH = "data/features/features.csv"

MODEL_PATH = "models/random_forest.pkl"

# =========================
# LOAD DATA
# =========================

df = pd.read_csv(DATA_PATH)

# remove NaN
df = df.dropna()

# features
X = df.drop("label", axis=1)

# labels
y = df["label"].astype(str)

print("\nDataset shape:")
print(df.shape)

print("\nClass distribution:")
print(y.value_counts())

# =========================
# TRAIN TEST SPLIT
# =========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    stratify=y,
    random_state=42
)

# =========================
# MODEL
# =========================

model = RandomForestClassifier(
    n_estimators=100,
    max_depth=8,              # reduce overfitting
    min_samples_split=4,
    min_samples_leaf=2,
    random_state=42,
    class_weight="balanced"
)

# =========================
# CROSS VALIDATION
# =========================

cv_scores = cross_val_score(
    model,
    X,
    y,
    cv=5
)

print("\nCross Validation Scores:")
print(cv_scores)

print("\nAverage CV Accuracy:")
print(np.mean(cv_scores))

# =========================
# TRAIN
# =========================

model.fit(X_train, y_train)

# =========================
# PREDICT
# =========================

y_pred = model.predict(X_test)

# =========================
# EVALUATION
# =========================

print("\nClassification Report\n")

print(
    classification_report(
        y_test,
        y_pred
    )
)

print("\nConfusion Matrix\n")

print(
    confusion_matrix(
        y_test,
        y_pred
    )
)

# =========================
# SAVE MODEL
# =========================

joblib.dump(
    model,
    MODEL_PATH
)

print("\nModel saved successfully.")