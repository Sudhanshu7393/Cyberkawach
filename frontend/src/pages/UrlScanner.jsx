import { classifyUrlClient } from '../utils/engine';
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
  FileSpreadsheet
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function UrlScanner({ onBack }) {
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);

  const fetchHistoryAndStats = async () => {
    try {
      const [histRes, statsRes] = await Promise.all([
        axios.get('/api/url/history'),
        axios.get('/api/url/stats')
      ]);
      if (histRes.data?.data) setHistory(histRes.data.data);
      if (statsRes.data?.data) setStats(statsRes.data.data);
    } catch (err) {
      console.error('Error fetching URL data:', err);
    }
  };

  useEffect(() => {
    fetchHistoryAndStats();
  }, []);

  const handleScan = async (targetUrl) => {
    const urlToScan = targetUrl || urlInput;
    if (!urlToScan || !urlToScan.trim()) return alert('Please enter a valid URL.');

    setIsScanning(true);
    try {
      const res = await axios.post('/api/url/scan', { url: urlToScan.trim() }, { timeout: 2500 });
      if (res.data?.data) {
        setScanResult(res.data.data);
        setUrlInput(urlToScan);
        await fetchHistoryAndStats();
      }
    } catch (err) {
      // Autonomous Client-Side Lexical & Shannon Entropy Engine (Guarantees working on Vercel without backend)
      const clientResult = classifyUrlClient(urlToScan.trim());
      setScanResult(clientResult);
      setUrlInput(urlToScan);
      setHistory(prev => {
        const next = [clientResult, ...prev].slice(0, 50);
        const malicious = next.filter(i => i.prediction !== 'BENIGN').length;
        setStats({
          total_scans: next.length,
          malicious_detected: malicious,
          safe_urls: next.length - malicious
        });
        return next;
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Clear URL scan history?')) return;
    try {
      await axios.post('/api/url/clear');
      setHistory([]);
      setScanResult(null);
      await fetchHistoryAndStats();
    } catch (err) {
      console.error('Error clearing scans:', err);
    }
  };

  const sampleUrls = [
    { url: 'https://google.com/search?q=cybersecurity', label: '🟢 Legitimate Portal (Safe)', fill: 'https://google.com/search?q=cybersecurity' },
    { url: 'http://paypal-security-verification-update.com/login.php', label: '🔴 PayPal Phishing Link', fill: 'http://paypal-security-verification-update.com/login.php' },
    { url: 'http://185.220.101.5/malware_payload.exe', label: '🟣 Malware Binary Host', fill: 'http://185.220.101.5/malware_payload.exe' },
    { url: 'http://secure-banking-login@free-bonus-claim.net/account', label: '🔴 Deceptive @ Delimiter', fill: 'http://secure-banking-login@free-bonus-claim.net/account' }
  ];

  return (
    <div className="space-y-8 py-6 text-left font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400 font-bold mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>Layer 2: Web Page Classification For Safer Browsing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Real-Time URL & Webpage Threat Scanner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Evaluates lexical, syntactic, and structural token distributions to classify web destinations as Benign, Phishing, or Malware hosts.
          </p>
        </div>

        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition cursor-pointer self-start sm:self-auto"
        >
          &larr; Back to SOC Console
        </button>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="p-5 rounded-2xl bg-[#151D2A] border border-slate-800/80">
          <span className="text-xs text-slate-400 block uppercase">Total Scanned</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{stats?.total_scanned || 0}</p>
          <span className="text-[10px] text-slate-500">Evaluated URLs</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#151D2A] border border-emerald-500/30">
          <span className="text-xs text-emerald-400 block uppercase">Benign (Safe)</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">{stats?.safe_count || 0}</p>
          <span className="text-[10px] text-emerald-400/70">Verified Legit Portals</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#151D2A] border border-rose-500/30">
          <span className="text-xs text-rose-400 block uppercase">Phishing Detected</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-1">{stats?.phishing_count || 0}</p>
          <span className="text-[10px] text-rose-400/70">Credential Harvesting</span>
        </div>
        <div className="p-5 rounded-2xl bg-[#151D2A] border border-purple-500/30">
          <span className="text-xs text-purple-400 block uppercase">Malware Hosts</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 mt-1">{stats?.malware_count || 0}</p>
          <span className="text-[10px] text-purple-400/70">Executable Binaries</span>
        </div>
      </div>

      {/* URL Input Bar */}
      <div className="p-6 rounded-3xl bg-[#151D2A] border border-slate-800/80 shadow-2xl space-y-4">
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
              placeholder="Enter URL to inspect (e.g. http://paypal-security-verification.com/login)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#0D1117] border border-slate-700 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-amber-400 transition"
            />
          </div>
          <button
            type="submit"
            disabled={isScanning}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm font-sans flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isScanning ? (
              <>
                <Cpu className="w-4 h-4 animate-spin" />
                <span>Analyzing Lexical Tokens...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Scan URL For Threats 🔍</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Test URL Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-mono">Quick Test Scenarios:</span>
          {sampleUrls.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleScan(s.fill)}
              className="text-xs px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition cursor-pointer font-mono"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Scan Result Card */}
      {scanResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-6 rounded-3xl border shadow-2xl space-y-6 font-mono ${
            scanResult.category === 'BENIGN'
              ? 'bg-[#151D2A] border-emerald-500/40 shadow-emerald-500/5'
              : (scanResult.category === 'MALWARE' ? 'bg-[#151D2A] border-purple-500/40 shadow-purple-500/5' : 'bg-[#151D2A] border-rose-500/40 shadow-rose-500/5')
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Inspected Target URL</span>
              <p className="text-base font-bold text-white break-all">{scanResult.url}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border ${
                scanResult.category === 'BENIGN'
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : (scanResult.category === 'MALWARE' ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' : 'bg-rose-500/15 text-rose-400 border-rose-500/30')
              }`}>
                {scanResult.verdict}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#0D1117] border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block uppercase">URL Risk Score</span>
              <p className={`text-4xl font-black mt-1 ${
                scanResult.risk_score >= 60 ? 'text-rose-400' : (scanResult.risk_score >= 30 ? 'text-amber-400' : 'text-emerald-400')
              }`}>
                {scanResult.risk_score} <span className="text-xs text-slate-500">/ 100</span>
              </p>
              <span className="text-[10px] text-slate-400 block mt-1">Severity: {scanResult.severity}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D1117] border border-slate-800 space-y-2 col-span-2 font-sans">
              <span className="text-xs font-bold text-amber-400 font-mono uppercase block">
                Lexical & Syntactic Indicators
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {scanResult.threat_indicators.map((ind, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className={scanResult.category === 'BENIGN' ? 'text-emerald-400' : 'text-rose-400'}>&bull;</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Lexical Feature Matrix */}
          {scanResult.lexical_features && (
            <div className="p-4 rounded-2xl bg-[#0D1117] border border-slate-800 text-xs space-y-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[11px]">
                Extracted NLP & Lexical Feature Matrix
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-slate-300">
                <div>Length: <strong className="text-white">{scanResult.lexical_features.url_length} chars</strong></div>
                <div>Protocol: <strong className={scanResult.lexical_features.is_https ? 'text-emerald-400' : 'text-rose-400'}>{scanResult.lexical_features.is_https ? 'HTTPS (SSL)' : 'Insecure HTTP'}</strong></div>
                <div>Subdomains: <strong className="text-white">{scanResult.lexical_features.subdomain_count}</strong></div>
                <div>Entropy: <strong className="text-white">{scanResult.entropy} bits</strong></div>
                <div>Direct IP Host: <strong className={scanResult.lexical_features.has_ip ? 'text-rose-400' : 'text-slate-400'}>{scanResult.lexical_features.has_ip ? 'Yes (Suspicious)' : 'No'}</strong></div>
                <div>@ Delimiter: <strong className={scanResult.lexical_features.has_at_symbol ? 'text-rose-400' : 'text-slate-400'}>{scanResult.lexical_features.has_at_symbol ? 'Yes (Spoofing)' : 'No'}</strong></div>
                <div>Hyphen Count: <strong className="text-white">{scanResult.lexical_features.hyphen_count}</strong></div>
                <div>Executable Ext: <strong className={scanResult.lexical_features.has_malware_ext ? 'text-purple-400' : 'text-slate-400'}>{scanResult.lexical_features.has_malware_ext ? 'Yes (Malware)' : 'No'}</strong></div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* History Table */}
      <div className="p-6 rounded-3xl bg-[#151D2A] border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <span>Recent Webpage & URL Scan History</span>
          </h3>

          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-mono cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs font-mono border border-dashed border-slate-800 rounded-2xl">
            No URLs scanned yet. Enter any link above to run an instant lexical safety scan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Verdict</th>
                  <th className="py-2.5 px-3">Target URL</th>
                  <th className="py-2.5 px-3">Risk Score</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {history.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        h.category === 'BENIGN'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : (h.category === 'MALWARE' ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' : 'bg-rose-500/15 text-rose-400 border-rose-500/30')
                      }`}>
                        {h.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-200 max-w-xs truncate">{h.url}</td>
                    <td className="py-2.5 px-3 font-bold">
                      <span className={h.risk_score >= 50 ? 'text-rose-400' : 'text-emerald-400'}>
                        {h.risk_score} / 100
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(h.timestamp).toLocaleTimeString()}
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
