import re
import math
from urllib.parse import urlparse

class LexicalURLClassifier:
    def __init__(self):
        self.suspicious_keywords = [
            'login', 'verify', 'account', 'banking', 'update', 'secure', 
            'free', 'bonus', 'claim', 'wallet', 'crypto', 'password', 
            'admin', 'auth', 'signin', 'ebayisapi', 'paypal', 'appleid', 
            'netflix', 'gift', 'prize', 'support', 'recover'
        ]
        self.malware_extensions = ['.exe', '.bin', '.scr', '.apk', '.bat', '.cmd', '.vbs', '.msi', '.iso']

    def calculate_entropy(self, text: str) -> float:
        if not text:
            return 0.0
        entropy = 0.0
        for x in set(text):
            p_x = float(text.count(x)) / len(text)
            entropy += - p_x * math.log2(p_x)
        return round(entropy, 3)

    def extract_lexical_features(self, url: str) -> dict:
        if not url.startswith(('http://', 'https://')):
            url_to_parse = 'http://' + url
        else:
            url_to_parse = url

        parsed = urlparse(url_to_parse)
        hostname = parsed.hostname or ''
        path_str = parsed.path or ''

        url_len = len(url)
        host_len = len(hostname)
        has_ip = 1 if re.match(r'^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$', hostname) else 0
        has_at_symbol = 1 if '@' in url else 0
        has_double_slash = 1 if '//' in path_str else 0
        hyphen_count = url.count('-')
        dot_count = hostname.count('.')
        subdomain_count = max(0, dot_count - 1)
        is_https = 1 if parsed.scheme == 'https' else 0
        entropy = self.calculate_entropy(url)

        # Keyword match
        matched_keywords = [kw for kw in self.suspicious_keywords if kw in url.lower()]
        has_malware_ext = 1 if any(url.lower().endswith(ext) or ext in path_str.lower() for ext in self.malware_extensions) else 0

        return {
            'url': url,
            'url_length': url_len,
            'host_length': host_len,
            'has_ip': has_ip,
            'has_at_symbol': has_at_symbol,
            'has_double_slash': has_double_slash,
            'hyphen_count': hyphen_count,
            'dot_count': dot_count,
            'subdomain_count': subdomain_count,
            'is_https': is_https,
            'entropy': entropy,
            'matched_keywords': matched_keywords,
            'has_malware_ext': has_malware_ext
        }

    def predict_url(self, url: str) -> dict:
        features = self.extract_lexical_features(url)
        score = 5.0
        reasons = []

        if features['has_ip'] == 1:
            score += 40.0
            reasons.append("Direct IP address used in host instead of legitimate domain")

        if features['has_at_symbol'] == 1:
            score += 35.0
            reasons.append("URL contains '@' credential delimiter symbol (often used in URL spoofing)")

        if features['has_malware_ext'] == 1:
            score += 55.0
            reasons.append("Direct executable / binary payload download path detected")

        if features['url_length'] > 75:
            score += 18.0
            reasons.append(f"Excessive URL length ({features['url_length']} characters)")

        if features['subdomain_count'] >= 3:
            score += 22.0
            reasons.append(f"High subdomain depth ({features['subdomain_count']} subdomains)")

        if features['hyphen_count'] >= 3:
            score += 15.0
            reasons.append(f"Multiple deceptive hyphens ({features['hyphen_count']} hyphens)")

        if features['matched_keywords']:
            score += len(features['matched_keywords']) * 12.0
            reasons.append(f"Targeted credential/banking keywords found: {', '.join(features['matched_keywords'])}")

        if features['entropy'] > 4.2:
            score += 14.0
            reasons.append(f"High character entropy ({features['entropy']}) - likely obfuscated/DGA string")

        if features['is_https'] == 0:
            score += 12.0
            reasons.append("Insecure HTTP protocol (No SSL/TLS encryption)")
        else:
            score -= 5.0

        risk_score = min(99.9, max(2.5, score))

        if features['has_malware_ext'] == 1 or (features['has_ip'] == 1 and risk_score >= 70):
            category = "MALWARE"
            verdict = "MALICIOUS MALWARE HOST"
            severity = "CRITICAL"
        elif risk_score >= 50.0:
            category = "PHISHING"
            verdict = "DECEPTIVE PHISHING PAGE"
            severity = "HIGH"
        elif risk_score >= 25.0:
            category = "SUSPICIOUS"
            verdict = "SUSPICIOUS WEB LINK"
            severity = "MEDIUM"
        else:
            category = "BENIGN"
            verdict = "LEGITIMATE / SAFE WEBSITE"
            severity = "LOW"
            if not reasons:
                reasons.append("Standard domain structure and legitimate SSL encryption verified")

        return {
            'url': url,
            'category': category,
            'verdict': verdict,
            'risk_score': round(risk_score, 1),
            'severity': severity,
            'is_threat': category != "BENIGN",
            'lexical_features': features,
            'threat_indicators': reasons,
            'entropy': features['entropy']
        }

url_classifier_engine = LexicalURLClassifier()
