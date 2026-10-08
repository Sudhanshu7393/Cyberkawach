# 🛡️ CyberKawach: AI-Powered Network Anomaly Detection System

> An end-to-end **AI/ML + Full-Stack Cybersecurity Platform** for real-time unsupervised network intrusion detection, risk scoring, threat intelligence search, and live telemetry visualization.

---

## 📌 Project Overview

This is an **AI/ML + Full-Stack** cybersecurity system designed to identify abnormal and malicious network traffic behaviors. Unlike static, rule-based firewalls that attackers can easily evade, this system leverages **Unsupervised Machine Learning (Isolation Forest)** to model normal user and network baselines, detecting zero-day anomalies and stealthy attack patterns in real time.

### Key Capabilities
- **🧠 Machine Learning Engine**: Isolation Forest with statistical path length anomaly evaluation and normalized 0–100 risk scoring.
- **⚡ Automated Threat Explainability**: Pinpoints the exact root causes of alerts (e.g., brute-force login bursts, off-hours exfiltration, geographic shift / impossible travel, high request velocity).
- **📊 Real-time SOC Dashboard**: Interactive live telemetry, risk timeline charts, geographical attack concentration, and severity metrics.
- **🧪 Ingestion & Attack Simulator**: Single log simulator with 1-click attack presets (Normal, Brute Force, Exfiltration, DDoS Botnet) and enterprise CSV batch upload.
- **🔍 Threat Intelligence Search**: Deep investigative query tool by User ID, IP Address, or Country code.
- **💾 Dual Database Mode**: Ready-to-use with **Supabase Cloud Database** or instant **Local Persistent Storage fallback** (no setup needed).

---

## 🏗️ System Architecture

```
network-anomaly-detection/
│
├── ml-service/                 # Python Machine Learning Microservice
│   ├── data/
│   │   ├── raw/                # Synthetic network traffic dataset
│   │   ├── processed/          # Cleaned & feature-engineered logs
│   │   └── generate_dataset.py # High-fidelity realistic traffic & attack generator
│   ├── model/
│   │   ├── isolation_forest.py # Standalone, zero-dependency Isolation Forest algorithm
│   │   ├── scaler.py           # Feature normalization scaler
│   │   ├── train.py            # Training pipeline & evaluation metrics
│   │   ├── isolation_forest.pkl# Saved model artifact
│   │   └── scaler.pkl          # Saved scaler artifact
│   ├── predict.py              # Anomaly prediction, risk score (0-100), threat reasoning
│   ├── app.py                  # FastAPI REST microservice (Port 8000)
│   └── requirements.txt
│
├── backend/                    # Node.js + Express Backend API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Supabase client + local persistent fallback
│   │   ├── routes/
│   │   │   ├── logs.js         # Log ingestion, CSV parsing, sample generator
│   │   │   ├── predictions.js  # Prediction history, stats & KPI aggregates
│   │   │   └── search.js       # IP & User threat intelligence search
│   │   └── server.js           # Express application entrypoint (Port 5000)
│   ├── data/
│   │   └── predictions.json    # Local persistent audit logs store
│   └── package.json
│
├── frontend/                   # React.js SOC Dashboard (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Header, connection badge & navigation
│   │   │   ├── RiskScoreCard.jsx # Threat score gauge & severity visualizer
│   │   │   ├── TimelineChart.jsx # Recharts risk timeline area chart
│   │   │   └── CountryDistribution.jsx # Geographic threat distribution list
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx   # Real-time SOC dashboard & event stream
│   │   │   ├── LogUpload.jsx   # Single session simulator & CSV upload
│   │   │   ├── SearchReports.jsx # Threat investigator search view
│   │   │   └── ModelExplain.jsx# Mathematical & architectural explainability
│   │   └── App.jsx
│   └── package.json
│
├── start-all.bat               # 1-Click launcher for all 3 services
├── start-ml.bat                # Launch Python FastAPI ML Service
├── start-backend.bat           # Launch Node.js Express API
├── start-frontend.bat          # Launch React Vite UI
└── README.md
```

---

## 🔬 Feature Vector & ML Algorithm

The model analyzes 7 key numerical features extracted from network sessions:

| Feature Name | Type | Cybersecurity Significance |
| :--- | :--- | :--- |
| `login_hour` | Int (0–23) | Identifies odd-hours access spikes (e.g. 2:00 AM – 5:00 AM). |
| `country_change_flag` | Binary (0/1) | Flags impossible travel or sudden geographical session jumps. |
| `download_mb` | Float (MB) | Detects bulk unauthorized data downloading or scraping. |
| `upload_mb` | Float (MB) | Flags potential data exfiltration and intellectual property theft. |
| `session_duration_sec` | Int (sec) | Differentiates automated bot bursts from human interactive sessions. |
| `failed_login_count` | Int | Captures password spraying and brute-force credential stuffing. |
| `requests_per_minute` | Int | Detects automated port scanners, DDoS bursts, and scrapers. |

### Anomaly Score Formula
Isolation Forest computes average tree path length $E(h(x))$ and derives the score:
$$s(x, n) = 2^{-\frac{E(h(x))}{c(n)}}$$
- **$s \to 1.0$**: Point isolates quickly in few splits $\implies$ **High Threat Anomaly**.
- **$s \to 0.5$**: Normal baseline behavior.

---

## 🚀 Quick Start (Running the Project)

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

### Option 1: 1-Click Launch (Windows)
Double-click **`start-all.bat`** in the project root directory. This will open 3 terminals running:
1. `ml-service` on `http://localhost:8000`
2. `backend` on `http://localhost:5000`
3. `frontend` on `http://localhost:5173`

Open your browser at **`http://localhost:5173`**.

---

### Option 2: Manual Step-by-Step Launch

#### 1. ML Microservice (Python FastAPI)
```bash
cd ml-service
# Activate virtual environment
.\venv\Scripts\activate
# Start FastAPI
python -m uvicorn app:app --port 8000 --reload
```
*Swagger API Docs available at `http://localhost:8000/docs`*

#### 2. Backend API (Node.js + Express)
```bash
cd backend
npm start
```
*Running on `http://localhost:5000`*

#### 3. Frontend (React + Vite)
```bash
cd frontend
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 🌐 Supabase Cloud Configuration (Optional)

To connect Supabase instead of local storage:
1. Create a table in Supabase SQL Editor:
```sql
create table predictions (
  id uuid default gen_random_uuid() primary key,
  user_id text,
  ip_address text,
  country text,
  browser text,
  device text,
  login_hour int,
  country_change_flag int,
  download_mb float,
  upload_mb float,
  session_duration_sec int,
  failed_login_count int,
  requests_per_minute int,
  is_anomaly boolean,
  risk_score float,
  severity text,
  threat_reasons text,
  created_at timestamp default now()
);
```
2. Paste your credentials into `backend/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-or-service-key
```

---

## 🎯 Viva / Evaluation Highlights

1. **Why Unsupervised Learning?** Real cyber attacks rarely have pre-labeled data. Isolation Forest detects novel zero-day attacks without requiring labeled historical anomalies.
2. **Microservices Architecture**: ML logic is completely isolated in FastAPI, allowing horizontal scaling and independent model retraining without disrupting the Express/React full-stack layers.
3. **Defense in Depth**: Combines ML anomaly scoring with automated root-cause explanations (e.g. why a 95.3 risk score was assigned).
