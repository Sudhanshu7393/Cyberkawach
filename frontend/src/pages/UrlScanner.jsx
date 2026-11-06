import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Globe,
  Search,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Flame,
  ArrowRight,
  ExternalLink,
  History,
  Trash2,
  Cpu,
  Lock,
  Unlock,
  CheckCircle2,
  FileSpreadsheet,
  ClipboardPaste,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { classifyUrlClient } from '../utils/engine';

export default function UrlScanner({ onBack }) {
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    total_scanned: 0,
    safe_count: 0,
    phishing_count: 0,
    malware_count: 0
  });

  const computeUrlStats = (historyList) => {
    const total = historyList.length;
    const safe = historyList.filter(i => i.category === 'BENIGN').length;
    const phishing = historyList.filter(i => i.category === 'PHISHING' || i.category === 'SUSPICIOUS').length;
    const malware = historyList.filter(i => i.category === 'MALWARE').length;
    return {
      total_scanned: total,
      safe_count: safe,
      phishing_count: phishing,
      malware_count: malware
    };
  };

  const fetchHistoryAndStats = async () => {
    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    if (isLocalhost) {
      try {
        const [histRes, statsRes] = await Promise.all([
          axios.get('/api/url/history', { timeout: 2000 }),
          axios.get('/api/url/stats', { timeout: 2000 })
        ]);
        if (histRes.data && typeof histRes.data === 'object' && typeof histRes.data !== 'string' && histRes.data.data) {
          setHistory(histRes.data.data);
        }
        if (statsRes.data && typeof statsRes.data === 'object' && typeof statsRes.data !== 'string' && statsRes.data.data) {
          setStats(statsRes.data.data);
        }
      } catch (err) {
        // Fallback
      }
    }
  };

  useEffect(() => {
    fetchHistoryAndStats();
  }, []);

  const handleScan = async (targetUrl) => {
    const urlToScan = targetUrl || urlInput;
    if (!urlToScan || !urlToScan.trim()) return alert('Please enter a valid URL.');

    setIsScanning(true);
    const cleanUrl = urlToScan.trim();
    setUrlInput(cleanUrl);

    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    let result = null;

    if (isLocalhost) {
      try {
        const res = await axios.post('/api/url/scan', { url: cleanUrl }, { timeout: 2500 });
        if (res.data && typeof res.data === 'object' && typeof res.data !== 'string' && res.data.data) {
          result = res.data.data;
        }
      } catch (err) {
        // Fallback to client engine
      }
    }

    if (!result) {
      result = classifyUrlClient(cleanUrl);
    }

    setScanResult(result);
    setHistory(prev => {
      const next = [result, ...prev.filter(i => i.url !== result.url)].slice(0, 50);
      setStats(computeUrlStats(next));
      return next;
    });

    setIsScanning(false);
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Clear URL scan history?')) return;
    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    if (isLocalhost) {
      try {
        await axios.post('/api/url/clear', {}, { timeout: 1500 });
      } catch (err) {}
    }
    setHistory([]);
    setScanResult(null);
    setStats({
      total_scanned: 0,
      safe_count: 0,
      phishing_count: 0,
      malware_count: 0
    });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text.trim());
      }
    } catch (e) {
      // Clipboard read denied
    }
  };

  const sampleUrls = [
    { url: 'https://google.com/search?q=cybersecurity', label: '🟢 Google Portal (Safe)', fill: 'https://google.com/search?q=cybersecurity' },
    { url: 'http://paypal-security-verification-update.com/login.php', label: '🔴 PayPal Credential Phish', fill: 'http://paypal-security-verification-update.com/login.php' },
    { url: 'http://185.220.101.5/malware_payload.exe', label: '🟣 Raw IP Binary Download', fill: 'http://185.220.101.5/malware_payload.exe' },
    { url: 'http://secure-banking-login@free-bonus-claim.net/account', label: '🔴 Deceptive @ Delimiter', fill: 'http://secure-banking-login@free-bonus-claim.net/account' }
  ];

  return (
    <div className="space-y-8 py-4 sm:py-6 text-left font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-mono text-emerald-400 font-semibold mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>Layer 2 Defense &bull; Web Page Classification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Webpage Safety & Phishing Scanner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Inspect suspect URLs before employees click. Evaluates Shannon Entropy, lexical obfuscation, and brand impersonation tokens in real time.
          </p>
        </div>

        <button
          onClick={onBack}
          className="btn-tactile px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-white/[0.08] hover:border-white/20 transition cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
          <span>Back to Telemetry Monitor</span>
        </button>
      </div>

      {/* 4 Human Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 font-mono">
        <div className="p-5 rounded-2xl glass-card-interactive">
          <span className="text-xs text-slate-400 block uppercase font-sans">Total Inspected</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{stats?.total_scanned || 0}</p>
          <span className="text-[10px] text-slate-500 font-sans">Scanned destinations</span>
        </div>
        <div className="p-5 rounded-2xl glass-card-interactive border-emerald-500/25">
          <span className="text-xs text-emerald-400 block uppercase font-sans font-bold">Safe & Verified</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">{stats?.safe_count || 0}</p>
          <span className="text-[10px] text-emerald-400/70 font-sans">Legitimate websites</span>
        </div>
        <div className="p-5 rounded-2xl glass-card-interactive border-rose-500/25">
          <span className="text-xs text-rose-400 block uppercase font-sans font-bold">Phishing Lures</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-1">{stats?.phishing_count || 0}</p>
          <span className="text-[10px] text-rose-400/70 font-sans">Credential harvesting</span>
        </div>
        <div className="p-5 rounded-2xl glass-card-interactive border-purple-500/25">
          <span className="text-xs text-purple-400 block uppercase font-sans font-bold">Malware Hosts</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 mt-1">{stats?.malware_count || 0}</p>
          <span className="text-[10px] text-purple-400/70 font-sans">Binary download targets</span>
        </div>
      </div>

      {/* URL Omnibar Search Dock */}
      <div className="p-6 sm:p-7 rounded-3xl glass-panel space-y-4">
        <form
          onSubmit={(e) => { e.preventDefault(); handleScan(); }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste or enter URL to inspect (e.g. http://paypal-security-verification.com/login)..."
              className="w-full pl-12 pr-20 py-3.5 rounded-2xl bg-[#080C14]/90 border border-white/[0.1] text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-amber-400/80 transition shadow-inner"
            />
            <button
              type="button"
              onClick={handlePaste}
              title="Paste from clipboard"
              className="absolute right-3 top-2.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-sans transition flex items-center gap-1 cursor-pointer"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>Paste</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isScanning}
            className="btn-tactile px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm font-sans flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isScanning ? (
              <>
                <Cpu className="w-4 h-4 animate-spin" />
                <span>Analyzing URL Structure...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Scan URL Safety 🔍</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Test Scenario Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-sans font-medium">Quick Test Links:</span>
          {sampleUrls.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleScan(s.fill)}
              className="btn-tactile text-xs px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] hover:border-white/20 text-slate-300 transition cursor-pointer font-sans"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Scan Result Card */}
      {scanResult && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`p-6 sm:p-7 rounded-3xl border shadow-2xl space-y-6 ${
            scanResult.category === 'BENIGN'
              ? 'glass-panel border-emerald-500/40 shadow-emerald-500/5'
              : (scanResult.category === 'MALWARE' 
                  ? 'glass-panel border-purple-500/40 shadow-purple-500/5' 
                  : 'glass-panel border-rose-500/40 shadow-rose-500/5')
          }`}
        >
          {/* Target URL & Verdict Pill */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider block font-mono">
                Evaluated Destination
              </span>
              <p className="text-base font-bold text-white break-all font-mono">{scanResult.url}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className={`px-4 py-2 rounded-xl text-xs font-extrabold font-mono border inline-flex items-center gap-1.5 ${
                scanResult.category === 'BENIGN'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                  : (scanResult.category === 'MALWARE' 
                      ? 'bg-purple-500/15 text-purple-300 border-purple-500/40' 
                      : 'bg-rose-500/15 text-rose-300 border-rose-500/40')
              }`}>
                {scanResult.category === 'BENIGN' ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-rose-400" />}
                <span>{scanResult.verdict}</span>
              </span>
            </div>
          </div>

          {/* 3 Metric Summary Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Risk Gauge */}
            <div className="p-5 rounded-2xl bg-[#080C14]/90 border border-white/[0.06] text-center flex flex-col justify-center font-mono">
              <span className="text-xs text-slate-400 block uppercase font-sans">Risk Assessment Score</span>
              <p className={`text-4xl font-black mt-1 ${
                scanResult.risk_score >= 60 ? 'text-rose-400' : (scanResult.risk_score >= 30 ? 'text-amber-400' : 'text-emerald-400')
              }`}>
                {scanResult.risk_score} <span className="text-xs text-slate-500">/ 100</span>
              </p>
              <span className="text-[11px] text-slate-400 block mt-1 font-sans">
                Severity: <strong className="text-white">{scanResult.severity}</strong>
              </span>
            </div>

            {/* Plain English Indicators */}
            <div className="p-5 rounded-2xl bg-[#080C14]/90 border border-white/[0.06] space-y-2 col-span-2 font-sans">
              <span className="text-xs font-bold text-amber-400 font-mono uppercase block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>What Our Lexical Classifier Spotted:</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {(scanResult.threat_indicators || []).map((ind, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className={scanResult.category === 'BENIGN' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {scanResult.category === 'BENIGN' ? '✓' : '⚠️'}
                    </span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Lexical Feature Matrix & Shannon Entropy */}
          {scanResult.lexical_features && (
            <div className="p-4 rounded-2xl bg-[#080C14]/70 border border-white/[0.05] text-xs space-y-2 font-mono">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                <span>Extracted Lexical Dimensions</span>
                <span className="text-amber-400">Shannon Entropy H(X): {scanResult.entropy ?? scanResult.lexical_features?.entropy ?? 0}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-slate-300">
                <div>URL Length: <strong className="text-white">{scanResult.lexical_features.url_length} chars</strong></div>
                <div>Protocol: <strong className={scanResult.lexical_features.is_https ? 'text-emerald-400' : 'text-rose-400'}>{scanResult.lexical_features.is_https ? 'HTTPS (Encrypted)' : 'Insecure HTTP'}</strong></div>
                <div>Subdomains: <strong className="text-white">{scanResult.lexical_features.subdomain_count}</strong></div>
                <div>Direct IP Host: <strong className={scanResult.lexical_features.has_ip ? 'text-rose-400' : 'text-emerald-400'}>{scanResult.lexical_features.has_ip ? 'Yes (Suspicious)' : 'No (FQDN)'}</strong></div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Scan History Table */}
      <div className="p-6 sm:p-7 rounded-3xl glass-panel space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white font-sans">
              Scan History Ledger
            </h3>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-xs text-rose-400 hover:text-rose-300 font-mono transition flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs font-mono">
            No URLs scanned yet. Enter a link above to start evaluating web destinations.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-[#080C14]/80">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 uppercase text-[11px] bg-slate-900/60">
                  <th className="py-3 px-4">Verdict</th>
                  <th className="py-3 px-4">Destination URL</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 px-4">Entropy</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-slate-300">
                {history.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        item.category === 'BENIGN'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}>
                        {item.category === 'BENIGN' ? '✓ SAFE' : '⚠️ THREAT'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white max-w-sm truncate">{item.url}</td>
                    <td className="py-3 px-4 font-bold">
                      <span className={item.risk_score >= 50 ? 'text-rose-400' : 'text-emerald-400'}>
                        {item.risk_score} / 100
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{item.entropy ?? item.lexical_features?.entropy ?? 0}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleScan(item.url)}
                        className="text-amber-400 hover:underline text-xs cursor-pointer font-sans font-medium"
                      >
                        Re-inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
