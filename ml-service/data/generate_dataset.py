import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_synthetic_network_data(n_records=10000, anomaly_ratio=0.06, random_seed=42):
    random.seed(random_seed)
    np.random.seed(random_seed)

    users = [f"USR_{i:04d}" for i in range(1, 150)]
    countries = ["US", "IN", "GB", "DE", "SG", "CA", "AU", "JP", "FR", "NL"]
    suspicious_countries = ["RU", "KP", "IR", "CN", "RO", "BR", "NG"]
    browsers = ["Chrome", "Firefox", "Safari", "Edge", "Opera"]
    devices = ["Windows 11", "macOS Sonoma", "Ubuntu Linux", "Android 14", "iOS 17"]

    base_time = datetime.now() - timedelta(days=7)
    records = []
    n_anomalies = int(n_records * anomaly_ratio)
    n_normal = n_records - n_anomalies

    # 1. Generate Normal Network Activities
    for _ in range(n_normal):
        user = random.choice(users)
        country = random.choice(countries)
        browser = random.choice(browsers)
        device = random.choice(devices)
        
        # Normal working / active hours (mostly 7 AM to 10 PM)
        if random.random() < 0.85:
            login_hour = random.randint(7, 21)
        else:
            login_hour = random.choice([22, 23, 0, 1, 6])
            
        country_change_flag = 1 if random.random() < 0.02 else 0
        download_mb = round(max(0.1, np.random.exponential(scale=15.0) + random.uniform(1.0, 30.0)), 2)
        upload_mb = round(max(0.05, np.random.exponential(scale=5.0) + random.uniform(0.5, 10.0)), 2)
        session_duration_sec = int(max(30, np.random.normal(loc=1200, scale=600)))
        failed_login_count = 0 if random.random() < 0.88 else random.choice([1, 2])
        requests_per_minute = int(max(1, np.random.normal(loc=15, scale=8)))
        
        time_offset = random.randint(0, 7 * 86400)
        timestamp = base_time + timedelta(seconds=time_offset)
        ip = f"{random.randint(11, 192)}.{random.randint(1, 254)}.{random.randint(1, 254)}.{random.randint(1, 254)}"

        records.append({
            "timestamp": timestamp.isoformat(),
            "user_id": user,
            "ip_address": ip,
            "country": country,
            "browser": browser,
            "device": device,
            "login_hour": login_hour,
            "country_change_flag": country_change_flag,
            "download_mb": download_mb,
            "upload_mb": upload_mb,
            "session_duration_sec": session_duration_sec,
            "failed_login_count": failed_login_count,
            "requests_per_minute": requests_per_minute,
            "is_anomaly": False,
            "anomaly_type": "Normal"
        })

    # 2. Generate Injected Cyber Threat Anomalies
    anomaly_patterns = ["Brute-Force Attack", "Data Exfiltration", "Impossible Travel/Hijack", "DDoS / Rapid Burst", "Odd-Hours Mass Scraping"]

    for _ in range(n_anomalies):
        user = random.choice(users)
        pattern = random.choice(anomaly_patterns)
        browser = random.choice(browsers)
        device = random.choice(devices)
        
        country = random.choice(suspicious_countries if random.random() < 0.7 else countries)
        time_offset = random.randint(0, 7 * 86400)
        timestamp = base_time + timedelta(seconds=time_offset)
        ip = f"{random.randint(193, 223)}.{random.randint(1, 254)}.{random.randint(1, 254)}.{random.randint(1, 254)}"

        if pattern == "Brute-Force Attack":
            login_hour = random.randint(0, 23)
            country_change_flag = 1
            download_mb = round(random.uniform(0.1, 5.0), 2)
            upload_mb = round(random.uniform(0.1, 2.0), 2)
            session_duration_sec = random.randint(5, 60)
            failed_login_count = random.randint(8, 35)
            requests_per_minute = random.randint(120, 450)

        elif pattern == "Data Exfiltration":
            login_hour = random.choice([1, 2, 3, 4, 5])
            country_change_flag = random.choice([0, 1])
            download_mb = round(random.uniform(2000.0, 15000.0), 2)
            upload_mb = round(random.uniform(1500.0, 10000.0), 2)
            session_duration_sec = random.randint(3600, 18000)
            failed_login_count = random.choice([0, 1])
            requests_per_minute = random.randint(40, 100)

        elif pattern == "Impossible Travel/Hijack":
            login_hour = random.choice([2, 3, 4, 13, 23])
            country_change_flag = 1
            download_mb = round(random.uniform(200.0, 1200.0), 2)
            upload_mb = round(random.uniform(100.0, 800.0), 2)
            session_duration_sec = random.randint(10, 180)
            failed_login_count = random.randint(3, 7)
            requests_per_minute = random.randint(30, 80)

        elif pattern == "DDoS / Rapid Burst":
            login_hour = random.randint(0, 23)
            country_change_flag = random.choice([0, 1])
            download_mb = round(random.uniform(10.0, 50.0), 2)
            upload_mb = round(random.uniform(10.0, 50.0), 2)
            session_duration_sec = random.randint(1, 30)
            failed_login_count = random.randint(0, 10)
            requests_per_minute = random.randint(500, 2000)

        else: # Odd-Hours Mass Scraping
            login_hour = random.choice([2, 3, 4])
            country_change_flag = 1
            download_mb = round(random.uniform(3000.0, 8000.0), 2)
            upload_mb = round(random.uniform(50.0, 200.0), 2)
            session_duration_sec = random.randint(5000, 14000)
            failed_login_count = 0
            requests_per_minute = random.randint(150, 300)

        records.append({
            "timestamp": timestamp.isoformat(),
            "user_id": user,
            "ip_address": ip,
            "country": country,
            "browser": browser,
            "device": device,
            "login_hour": login_hour,
            "country_change_flag": country_change_flag,
            "download_mb": download_mb,
            "upload_mb": upload_mb,
            "session_duration_sec": session_duration_sec,
            "failed_login_count": failed_login_count,
            "requests_per_minute": requests_per_minute,
            "is_anomaly": True,
            "anomaly_type": pattern
        })

    random.shuffle(records)
    df = pd.DataFrame(records)
    
    # Save raw and processed
    raw_path = "data/raw/synthetic_network_traffic.csv"
    processed_path = "data/processed/network_logs.csv"
    
    df.to_csv(raw_path, index=False)
    df.to_csv(processed_path, index=False)
    print(f"Generated {len(df)} records ({n_normal} normal, {n_anomalies} anomalies).")
    print(f"Saved to {raw_path} and {processed_path}")

if __name__ == "__main__":
    generate_synthetic_network_data()
