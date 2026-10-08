from model.url_classifier import url_classifier_engine
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import random
from datetime import datetime, timedelta
import predict

# Ensure artifacts are loaded
predict.load_artifacts()

app = FastAPI(
    title="CyberKawach ML Inference Service",
    description="Machine Learning Microservice powered by Isolation Forest for real-time cyber threat & network anomaly detection.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LogRecord(BaseModel):
    user_id: Optional[str] = "USR_0001"
    ip_address: Optional[str] = "192.168.1.100"
    country: Optional[str] = "US"
    browser: Optional[str] = "Chrome"
    device: Optional[str] = "Windows 11"
    login_hour: int = Field(..., ge=0, le=23, description="Hour of the day (0-23)")
    country_change_flag: int = Field(0, ge=0, le=1, description="1 if country changed from previous session, else 0")
    download_mb: float = Field(..., ge=0.0, description="Megabytes downloaded")
    upload_mb: float = Field(..., ge=0.0, description="Megabytes uploaded")
    session_duration_sec: int = Field(..., ge=0, description="Session duration in seconds")
    failed_login_count: int = Field(0, ge=0, description="Count of failed login attempts")
    requests_per_minute: Optional[int] = Field(15, ge=0, description="Number of requests in one minute")
    timestamp: Optional[str] = None

class BatchLogRequest(BaseModel):
    logs: List[LogRecord]

@app.get("/")
def root():
    return {
        "service": "CyberKawach ML Inference Service",
        "status": "online",
        "model": "Isolation Forest",
        "endpoints": ["/predict", "/predict-batch", "/generate-sample-traffic", "/health", "/features"]
    }

@app.get("/health")
def health():
    return {
        "status": "healthy" if predict.model is not None else "model_not_loaded",
        "features": predict.FEATURE_COLUMNS
    }

@app.get("/features")
def get_features():
    return {"features": predict.FEATURE_COLUMNS}

@app.post("/predict")
def predict_endpoint(record: LogRecord):
    try:
        data_dict = record.model_dump()
        result = predict.predict_anomaly(data_dict)
        return {
            **data_dict,
            **result,
            "timestamp": data_dict.get("timestamp") or datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-batch")
def predict_batch_endpoint(payload: BatchLogRequest):
    try:
        dict_records = [r.model_dump() for r in payload.logs]
        results = predict.predict_batch(dict_records)
        return {
            "total_processed": len(results),
            "anomalies_detected": sum(1 for r in results if r.get("is_anomaly")),
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-sample-traffic")
def generate_sample(count: int = 10, anomaly_ratio: float = 0.2):
    try:
        users = [f"USR_{i:04d}" for i in range(101, 140)]
        countries = ["US", "IN", "GB", "DE", "SG", "CA", "JP", "FR", "RU", "CN"]
        browsers = ["Chrome", "Firefox", "Safari", "Edge"]
        devices = ["Windows 11", "macOS Sonoma", "Ubuntu Linux", "Android 14"]
        
        sample_logs = []
        now = datetime.now()

        for i in range(count):
            is_attack = random.random() < anomaly_ratio
            time_offset = random.randint(0, 3600 * 24)
            record_time = (now - timedelta(seconds=time_offset)).isoformat()
            
            if not is_attack:
                log = {
                    "user_id": random.choice(users),
                    "ip_address": f"192.168.{random.randint(1, 20)}.{random.randint(2, 250)}",
                    "country": random.choice(["US", "IN", "GB", "DE", "SG"]),
                    "browser": random.choice(browsers),
                    "device": random.choice(devices),
                    "login_hour": random.randint(8, 20),
                    "country_change_flag": 0,
                    "download_mb": round(random.uniform(5.0, 45.0), 2),
                    "upload_mb": round(random.uniform(1.0, 15.0), 2),
                    "session_duration_sec": random.randint(300, 3600),
                    "failed_login_count": 0 if random.random() < 0.9 else 1,
                    "requests_per_minute": random.randint(5, 30),
                    "timestamp": record_time
                }
            else:
                attack_type = random.choice(["brute_force", "exfiltration", "ddos", "geo_shift"])
                if attack_type == "brute_force":
                    log = {
                        "user_id": random.choice(users),
                        "ip_address": f"45.{random.randint(100, 200)}.{random.randint(1, 250)}.{random.randint(2, 250)}",
                        "country": random.choice(["RU", "CN", "IR", "KP"]),
                        "browser": "Python-requests/2.31",
                        "device": "Unknown Bot",
                        "login_hour": random.randint(0, 23),
                        "country_change_flag": 1,
                        "download_mb": 1.2,
                        "upload_mb": 0.4,
                        "session_duration_sec": 12,
                        "failed_login_count": random.randint(8, 28),
                        "requests_per_minute": random.randint(180, 450),
                        "timestamp": record_time
                    }
                elif attack_type == "exfiltration":
                    log = {
                        "user_id": random.choice(users),
                        "ip_address": f"104.{random.randint(10, 50)}.{random.randint(1, 250)}.{random.randint(2, 250)}",
                        "country": random.choice(["RU", "NL", "BR"]),
                        "browser": "Chrome",
                        "device": "Windows 11",
                        "login_hour": random.choice([2, 3, 4]),
                        "country_change_flag": 1,
                        "download_mb": round(random.uniform(4000, 12000), 2),
                        "upload_mb": round(random.uniform(2500, 8000), 2),
                        "session_duration_sec": random.randint(7200, 18000),
                        "failed_login_count": 0,
                        "requests_per_minute": random.randint(50, 120),
                        "timestamp": record_time
                    }
                elif attack_type == "ddos":
                    log = {
                        "user_id": "ANON_BOT",
                        "ip_address": f"185.{random.randint(50, 150)}.{random.randint(1, 250)}.{random.randint(2, 250)}",
                        "country": random.choice(["CN", "RU", "RO"]),
                        "browser": "Go-http-client",
                        "device": "Linux Server",
                        "login_hour": random.randint(0, 23),
                        "country_change_flag": 0,
                        "download_mb": 15.0,
                        "upload_mb": 15.0,
                        "session_duration_sec": 5,
                        "failed_login_count": 0,
                        "requests_per_minute": random.randint(600, 2500),
                        "timestamp": record_time
                    }
                else: # geo_shift
                    log = {
                        "user_id": random.choice(users),
                        "ip_address": f"194.{random.randint(10, 80)}.{random.randint(1, 250)}.{random.randint(2, 250)}",
                        "country": "KP",
                        "browser": "Firefox Nightly",
                        "device": "Android 14",
                        "login_hour": 3,
                        "country_change_flag": 1,
                        "download_mb": 650.0,
                        "upload_mb": 320.0,
                        "session_duration_sec": 95,
                        "failed_login_count": 4,
                        "requests_per_minute": 65,
                        "timestamp": record_time
                    }
            sample_logs.append(log)

        results = predict.predict_batch(sample_logs)
        return {
            "generated_count": len(results),
            "anomalies_detected": sum(1 for r in results if r.get("is_anomaly")),
            "logs": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class URLScanRequest(BaseModel):
    url: str

@app.post("/predict-url")
def predict_url_endpoint(req: URLScanRequest):
    """
    Evaluates lexical and structural properties of a URL to classify
    as Benign, Phishing, or Malware host for safer browsing.
    """
    if not req.url or not req.url.strip():
        raise HTTPException(status_code=400, detail="URL cannot be empty")
    return url_classifier_engine.predict_url(req.url.strip())

@app.get("/sample-urls")
def get_sample_urls():
    return [
        {"url": "https://google.com/search?q=cybersecurity", "type": "benign", "desc": "Legitimate Search Engine"},
        {"url": "http://paypal-security-verification-update.com/login.php", "type": "phishing", "desc": "Credential Phishing Attack"},
        {"url": "http://185.220.101.5/malware_payload.exe", "type": "malware", "desc": "Malware Executable Host"},
        {"url": "http://secure-banking-login@free-bonus-claim.net/account", "type": "phishing", "desc": "Deceptive @ Delimiter Phishing"}
    ]
