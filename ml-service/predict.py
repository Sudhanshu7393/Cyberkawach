import os
import sys
import joblib
import numpy as np

# Ensure root of ml-service is in sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from model.isolation_forest import PureIsolationForest, IsolationTree, IsolationTreeNode
from model.scaler import CustomStandardScaler

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
MODEL_PATH = os.path.join(MODEL_DIR, "isolation_forest.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")
FEATURES_PATH = os.path.join(MODEL_DIR, "feature_names.pkl")

FEATURE_COLUMNS = [
    'login_hour', 
    'country_change_flag', 
    'download_mb', 
    'upload_mb', 
    'session_duration_sec', 
    'failed_login_count', 
    'requests_per_minute'
]

model = None
scaler = None

def load_artifacts():
    global model, scaler, FEATURE_COLUMNS
    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        if os.path.exists(FEATURES_PATH):
            FEATURE_COLUMNS = joblib.load(FEATURES_PATH)
        print("ML Model & Scaler loaded successfully.")
    else:
        print("Model files not found. Training model now...")
        from model.train import train_model
        train_model()
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)

def extract_features(record: dict) -> list:
    return [
        float(record.get('login_hour', 12)),
        float(record.get('country_change_flag', 0)),
        float(record.get('download_mb', 10.0)),
        float(record.get('upload_mb', 2.0)),
        float(record.get('session_duration_sec', 600)),
        float(record.get('failed_login_count', 0)),
        float(record.get('requests_per_minute', 15))
    ]

def determine_threat_reasons(record: dict) -> list:
    reasons = []
    failed_logins = int(record.get('failed_login_count', 0))
    login_hour = int(record.get('login_hour', 12))
    upload_mb = float(record.get('upload_mb', 0))
    download_mb = float(record.get('download_mb', 0))
    rpm = float(record.get('requests_per_minute', 0))
    country_change = int(record.get('country_change_flag', 0))
    duration = int(record.get('session_duration_sec', 0))

    if failed_logins >= 5:
        reasons.append(f"Multiple consecutive failed logins ({failed_logins} attempts)")
    if country_change == 1:
        reasons.append("Unrecognized geographical origin / location shift")
    if (login_hour < 6 or login_hour > 23) and (upload_mb > 500 or download_mb > 1000):
        reasons.append(f"Off-hours high data transfer at {login_hour:02d}:00")
    if upload_mb > 1500:
        reasons.append(f"Unusually large data upload ({upload_mb:.1f} MB) - possible exfiltration")
    if download_mb > 4000:
        reasons.append(f"Massive data download ({download_mb:.1f} MB)")
    if rpm > 200:
        reasons.append(f"High request frequency ({rpm} requests/min) - possible bot/automated scan")
    if duration > 10800:
        reasons.append(f"Extended session duration ({duration // 3600}h {(duration % 3600)//60}m)")

    return reasons

def calculate_risk_score(raw_score: float, pred: int, record: dict) -> float:
    # raw_score is decision_function: < 0 is anomaly, > 0 is normal.
    # Sigmoid mapping centered at threshold
    scaled = (1.0 / (1.0 + np.exp(raw_score * 16.0))) * 100.0

    failed_logins = int(record.get('failed_login_count', 0))
    if failed_logins >= 8:
        scaled = max(scaled, 88.0)
    elif failed_logins >= 4:
        scaled = max(scaled, 68.0)

    if float(record.get('upload_mb', 0)) > 2000:
        scaled = max(scaled, 89.0)

    if float(record.get('requests_per_minute', 0)) > 500:
        scaled = max(scaled, 92.0)

    if pred == -1:
        scaled = max(55.0, scaled)
    else:
        scaled = min(48.0, scaled)

    return round(float(np.clip(scaled, 1.0, 99.9)), 2)

def predict_anomaly(record: dict) -> dict:
    if model is None or scaler is None:
        load_artifacts()

    features = extract_features(record)
    X = np.array([features])
    X_scaled = scaler.transform(X)

    pred = int(model.predict(X_scaled)[0])              # -1 = anomaly, 1 = normal
    raw_score = float(model.decision_function(X_scaled)[0])

    is_anomaly = bool(pred == -1)
    risk_score = calculate_risk_score(raw_score, pred, record)
    
    if risk_score >= 80:
        severity = "CRITICAL"
    elif risk_score >= 60:
        severity = "HIGH"
    elif risk_score >= 40:
        severity = "MEDIUM"
    else:
        severity = "LOW"

    threat_reasons = determine_threat_reasons(record)
    if is_anomaly and not threat_reasons:
        threat_reasons = ["Statistical deviation from baseline network behavior"]

    return {
        "is_anomaly": is_anomaly,
        "risk_score": risk_score,
        "severity": severity,
        "decision_score": round(raw_score, 4),
        "threat_reasons": threat_reasons
    }

def predict_batch(records: list) -> list:
    results = []
    for r in records:
        try:
            res = predict_anomaly(r)
            results.append({**r, **res})
        except Exception as e:
            results.append({**r, "error": str(e), "is_anomaly": False, "risk_score": 0.0, "severity": "UNKNOWN", "threat_reasons": []})
    return results
