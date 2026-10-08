import os
import sys
import pandas as pd
import numpy as np
import joblib

# Ensure current dir is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from model.isolation_forest import PureIsolationForest
from model.scaler import CustomStandardScaler

FEATURE_COLUMNS = [
    'login_hour', 
    'country_change_flag', 
    'download_mb', 
    'upload_mb', 
    'session_duration_sec', 
    'failed_login_count', 
    'requests_per_minute'
]

def train_model():
    data_path = os.path.join(os.path.dirname(__file__), "..", "data", "processed", "network_logs.csv")
    if not os.path.exists(data_path):
        print(f"Data file {data_path} not found. Generating synthetic dataset first...")
        from data.generate_dataset import generate_synthetic_network_data
        generate_synthetic_network_data()

    print(f"Loading data from {data_path}...")
    df = pd.read_csv(data_path)

    X = df[FEATURE_COLUMNS].values
    y_true = df['is_anomaly'].values.astype(bool)

    # Scale numeric features
    scaler = CustomStandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train Pure Isolation Forest
    print("Training Isolation Forest Anomaly Detection model...")
    model = PureIsolationForest(
        n_estimators=150,
        max_samples=256,
        contamination=0.06,
        random_state=42
    )
    model.fit(X_scaled)

    # Predictions
    preds = model.predict(X_scaled)
    y_pred = (preds == -1)

    tp = np.sum((y_true == True) & (y_pred == True))
    fp = np.sum((y_true == False) & (y_pred == True))
    tn = np.sum((y_true == False) & (y_pred == False))
    fn = np.sum((y_true == True) & (y_pred == False))

    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0

    print("\n========================================================")
    print("       MODEL TRAINING & VALIDATION EVALUATION           ")
    print("========================================================")
    print(f"Total Samples: {len(X)}")
    print(f"True Positives (Detected Attacks): {tp}")
    print(f"False Positives (Normal flagged as anomaly): {fp}")
    print(f"True Negatives (Normal correctly identified): {tn}")
    print(f"False Negatives (Missed attacks): {fn}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall:    {recall:.4f}")
    print(f"F1-Score:  {f1:.4f}")
    print(f"Isolation Forest Threshold: {model.threshold:.4f}")
    print("========================================================\n")

    # Save model and artifacts
    model_dir = os.path.join(os.path.dirname(__file__))
    os.makedirs(model_dir, exist_ok=True)
    joblib.dump(model, os.path.join(model_dir, "isolation_forest.pkl"))
    joblib.dump(scaler, os.path.join(model_dir, "scaler.pkl"))
    joblib.dump(FEATURE_COLUMNS, os.path.join(model_dir, "feature_names.pkl"))

    print("Model, Scaler, and Feature definitions successfully saved to ml-service/model/")

if __name__ == "__main__":
    train_model()
