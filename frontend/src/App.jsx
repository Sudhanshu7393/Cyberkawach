import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MetricsBar from './components/MetricsBar';
import ArchitectureMathSection from './components/ArchitectureMathSection';
import SocConsole from './components/SocConsole';
import UrlScanner from './pages/UrlScanner';
import CyberKawachLogo from './components/CyberKawachLogo';

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [dbStatus, setDbStatus] = useState('Local Storage');
  const [liveStreamActive, setLiveStreamActive] = useState(false);

  const streamIntervalRef = useRef(null);

  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [statsRes, logsRes] = await Promise.all([
        axios.get('/api/predictions/stats'),
        axios.get(`/api/predictions?limit=50&anomaly=${activeFilter === 'anomalies'}`)
      ]);

      if (statsRes.data?.data) setStats(statsRes.data.data);
      if (logsRes.data?.data) setLogs(logsRes.data.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [activeFilter]);

  // Clean dashboard on initial page load
  useEffect(() => {
    const initClean = async () => {
      try {
        await axios.post('/api/predictions/clear');
        fetchData();
      } catch (err) {
        console.error('Init clean error:', err);
      }
    };
    initClean();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    if (liveStreamActive) {
      streamIntervalRef.current = setInterval(async () => {
        try {
          await axios.post('/api/logs/generate-sample?count=1&ratio=0.25');
          fetchData();
        } catch (err) {
          console.error('Stream packet error:', err);
        }
      }, 2500);
    } else {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    }

    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, [liveStreamActive, fetchData]);

  const handleScenarioSimulation = async (scenario) => {
    let payload = {};
    if (scenario === 'normal') {
      payload = {
        user_id: 'USR_EMP_089',
        ip_address: '192.168.1.45',
        country: 'IN',
        browser: 'Chrome/124.0',
        device: 'Workstation Node',
        login_hour: 14,
        country_change_flag: 0,
        download_mb: 14.5,
        upload_mb: 2.1,
        session_duration_sec: 1800,
        failed_login_count: 0,
        requests_per_minute: 12
      };
    } else if (scenario === 'bruteforce') {
      payload = {
        user_id: 'USR_ROOT_AUTH',
        ip_address: '45.142.122.9',
        country: 'RU',
        browser: 'Hydra/v9.5',
        device: 'Foreign Proxy Server',
        login_hour: 3,
        country_change_flag: 1,
        download_mb: 1.2,
        upload_mb: 0.3,
        session_duration_sec: 14,
        failed_login_count: 18,
        requests_per_minute: 420
      };
    } else if (scenario === 'exfiltration') {
      payload = {
        user_id: 'USR_SEC_ADMIN',
        ip_address: '104.28.19.4',
        country: 'CN',
        browser: 'Curl/8.4.0',
        device: 'Encrypted Relay Node',
        login_hour: 2,
        country_change_flag: 1,
        download_mb: 9500.0,
        upload_mb: 6200.0,
        session_duration_sec: 12000,
        failed_login_count: 1,
        requests_per_minute: 88
      };
    } else if (scenario === 'ddos') {
      payload = {
        user_id: 'ANON_SYN_BOT',
        ip_address: '185.220.101.5',
        country: 'KP',
        browser: 'HTTP-Flooder/2.1',
        device: 'Compromised IoT Node',
        login_hour: 17,
        country_change_flag: 0,
        download_mb: 10.0,
        upload_mb: 10.0,
        session_duration_sec: 3,
        failed_login_count: 0,
        requests_per_minute: 2100
      };
    }

    try {
      const res = await axios.post('/api/logs/upload', payload);
      await fetchData();
      return res.data;
    } catch (err) {
      console.error('Simulation error:', err);
      return null;
    }
  };

  const handleGenerateSample = async (count = 8, ratio = 0.25) => {
    setIsGenerating(true);
    try {
      await axios.post(`/api/logs/generate-sample?count=${count}&ratio=${ratio}`);
      await fetchData();
    } catch (err) {
      console.error('Failed to generate sample:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Clear all stored telemetry predictions?')) return;
    setIsClearing(true);
    try {
      await axios.post('/api/predictions/clear');
      await fetchData();
    } catch (err) {
      console.error('Failed to clear logs:', err);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-300 relative font-sans overflow-x-hidden">
      {/* Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onRefresh={fetchData}
        isRefreshing={isRefreshing}
        liveStreamActive={liveStreamActive}
        setLiveStreamActive={setLiveStreamActive}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {activeView === 'home' && (
          <div className="space-y-12">
            {/* 1. Hero Overview */}
            <HeroSection
              onStartStream={() => setLiveStreamActive(!liveStreamActive)}
              liveStreamActive={liveStreamActive}
              stats={stats}
              logs={logs}
              onExploreUrlScanner={() => setActiveView('url-scanner')}
            />

            {/* 2. Core Metrics Bar */}
            <MetricsBar stats={stats} />

            {/* 3. Interactive Architecture & Dual ML Formulation */}
            <ArchitectureMathSection />

            {/* 4. Live SOC Defense Operations Console */}
            <SocConsole
              stats={stats}
              logs={logs}
              onGenerateSample={handleGenerateSample}
              onClearLogs={handleClearLogs}
              isGenerating={isGenerating}
              isClearing={isClearing}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              onRefresh={fetchData}
              liveStreamActive={liveStreamActive}
              setLiveStreamActive={setLiveStreamActive}
              onTriggerScenario={handleScenarioSimulation}
            />
          </div>
        )}

        {activeView === 'url-scanner' && (
          <UrlScanner onBack={() => setActiveView('home')} />
        )}
      </main>

      {/* Clean Cybersecurity Production Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0B0F17] py-10 mt-20 text-xs text-slate-400 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <CyberKawachLogo className="w-6 h-6 shrink-0" />
              <span className="text-sm font-bold text-white tracking-tight">CyberKawach</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                Dual-Layer Security Platform
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
              <span>Layer 1: Isolation Forest</span>
              <span>&bull;</span>
              <span>Layer 2: URL Classifier</span>
              <span>&bull;</span>
              <span className="text-emerald-400 font-semibold">● Services Live</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[11px] font-mono">
            <div>
              Anomaly Detection in Network Activities & Web Page Classification for Safer Browsing
            </div>
            <div>
              Academic Mini Project &bull; BCS554
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
