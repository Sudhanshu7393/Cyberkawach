import AlertCenterModal from './components/AlertCenterModal';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MetricsBar from './components/MetricsBar';
import ArchitectureMathSection from './components/ArchitectureMathSection';
import SocConsole from './components/SocConsole';
import UrlScanner from './pages/UrlScanner';
import CyberKawachLogo from './components/CyberKawachLogo';
import { generateRandomPacket, evaluateFlowClient } from './utils/engine';

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [stats, setStats] = useState({
    total_activities: 0,
    anomalies_detected: 0,
    normal_activities: 0,
    anomaly_percentage: '0.0',
    timeline: []
  });
  const [logs, setLogs] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [liveStreamActive, setLiveStreamActive] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const [alertToast, setAlertToast] = useState(null);

  const streamIntervalRef = useRef(null);
  const isBackendAvailable = useRef(true);

  // Recalculate stats from local logs if backend is offline (e.g. running on Vercel)
  const computeStatsFromLogs = (logList) => {
    const total = logList.length;
    const anomalies = logList.filter(l => l.is_anomaly || l.ml_inference?.is_anomaly).length;
    const normal = total - anomalies;
    const percentage = total > 0 ? ((anomalies / total) * 100).toFixed(1) : '0.0';

    const timeline = logList.slice(0, 15).reverse().map((l, idx) => ({
      timestamp: new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      risk_score: l.risk_score ?? l.ml_inference?.risk_score ?? 10,
      is_anomaly: l.is_anomaly ?? l.ml_inference?.is_anomaly ?? false
    }));

    return {
      total_activities: total,
      anomalies_detected: anomalies,
      normal_activities: normal,
      anomaly_percentage: percentage,
      timeline
    };
  };

  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [statsRes, logsRes] = await Promise.all([
        axios.get('/api/predictions/stats', { timeout: 2000 }),
        axios.get(`/api/predictions?limit=50&anomaly=${activeFilter === 'anomalies'}`, { timeout: 2000 })
      ]);

      if (statsRes.data?.data) setStats(statsRes.data.data);
      if (logsRes.data?.data) setLogs(logsRes.data.data);
      isBackendAvailable.current = true;

      try {
        const altRes = await axios.get('/api/alerts/history', { timeout: 1500 });
        if (altRes.data?.alerts) setAlertCount(altRes.data.alerts.length);
      } catch (e) {}
    } catch (err) {
      // Backend not running (Vercel public view on external device) -> Maintain client-side stats
      isBackendAvailable.current = false;
      setLogs(prev => {
        const filtered = activeFilter === 'anomalies' ? prev.filter(l => l.is_anomaly || l.ml_inference?.is_anomaly) : prev;
        setStats(computeStatsFromLogs(prev));
        return filtered;
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [activeFilter]);

  // Clean dashboard on initial page load
  useEffect(() => {
    const initClean = async () => {
      try {
        await axios.post('/api/predictions/clear', {}, { timeout: 1500 });
      } catch (err) {
        // Fallback: start with fresh state
        setLogs([]);
        setStats({
          total_activities: 0,
          anomalies_detected: 0,
          normal_activities: 0,
          anomaly_percentage: '0.0',
          timeline: []
        });
      }
      fetchData();
    };
    initClean();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Live Stream Handler (100% Autonomous on any device)
  useEffect(() => {
    if (liveStreamActive) {
      streamIntervalRef.current = setInterval(async () => {
        try {
          if (isBackendAvailable.current) {
            await axios.post('/api/logs/generate-sample?count=1&ratio=0.25', {}, { timeout: 2000 });
            fetchData();
          } else {
            throw new Error('Using autonomous client stream');
          }
        } catch (err) {
          // Autonomous generation
          const packet = generateRandomPacket();
          setLogs(prev => {
            const nextLogs = [packet, ...prev].slice(0, 50);
            setStats(computeStatsFromLogs(nextLogs));
            return nextLogs;
          });

          if (packet.is_anomaly) {
            setAlertCount(c => c + 1);
            setAlertToast({
              title: '🚨 Anomaly Detected & Dispatched',
              msg: `Off-hours deviation detected for IP ${packet.ip_address} (${packet.country}). Security warning auto-dispatched.`
            });
            setTimeout(() => setAlertToast(null), 4000);
          }
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
        id: 'PKT_' + Date.now(),
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
        requests_per_minute: 12,
        timestamp: new Date().toISOString()
      };
    } else if (scenario === 'bruteforce') {
      payload = {
        id: 'PKT_' + Date.now(),
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
        requests_per_minute: 420,
        timestamp: new Date().toISOString()
      };
    } else if (scenario === 'exfiltration') {
      payload = {
        id: 'PKT_' + Date.now(),
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
        requests_per_minute: 88,
        timestamp: new Date().toISOString()
      };
    } else if (scenario === 'ddos') {
      payload = {
        id: 'PKT_' + Date.now(),
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
        requests_per_minute: 2100,
        timestamp: new Date().toISOString()
      };
    }

    try {
      const res = await axios.post('/api/logs/upload', payload, { timeout: 2500 });
      await fetchData();
      if (res.data?.ml_inference?.is_anomaly) {
        triggerAlertNotification(payload);
      }
      return res.data;
    } catch (err) {
      // Offline / Vercel fallback evaluation
      const inference = evaluateFlowClient(payload);
      payload.ml_inference = inference;
      payload.risk_score = inference.risk_score;
      payload.is_anomaly = inference.is_anomaly;
      payload.root_cause = inference.root_cause;

      setLogs(prev => {
        const nextLogs = [payload, ...prev].slice(0, 50);
        setStats(computeStatsFromLogs(nextLogs));
        return nextLogs;
      });

      if (payload.is_anomaly) {
        setAlertCount(c => c + 1);
        triggerAlertNotification(payload);
      }
      return { success: true, data: payload, ml_inference: inference };
    }
  };

  const triggerAlertNotification = (payload) => {
    setAlertToast({
      title: '🚨 Critical Intrusion Detected!',
      msg: `Security alert email & SMS auto-dispatched for IP ${payload.ip_address} (${payload.country})`
    });
    setTimeout(() => setAlertToast(null), 5000);

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 CyberKawach Security Alert', {
        body: `Unauthorized attack detected on ID ${payload.user_id} from ${payload.ip_address}. Account protected.`
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  const handleGenerateSample = async (count = 8, ratio = 0.25) => {
    setIsGenerating(true);
    try {
      await axios.post(`/api/logs/generate-sample?count=${count}&ratio=${ratio}`, {}, { timeout: 2500 });
      await fetchData();
    } catch (err) {
      // Generate client-side samples
      const packets = [];
      for (let i = 0; i < count; i++) {
        packets.push(generateRandomPacket());
      }
      setLogs(prev => {
        const nextLogs = [...packets, ...prev].slice(0, 50);
        setStats(computeStatsFromLogs(nextLogs));
        return nextLogs;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Clear all stored telemetry predictions?')) return;
    setIsClearing(true);
    try {
      await axios.post('/api/predictions/clear', {}, { timeout: 2000 });
      await fetchData();
    } catch (err) {
      setLogs([]);
      setStats({
        total_activities: 0,
        anomalies_detected: 0,
        normal_activities: 0,
        anomaly_percentage: '0.0',
        timeline: []
      });
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
        onOpenAlerts={() => setAlertModalOpen(true)}
        alertCount={alertCount}
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

        {/* Real-Time Alert Toast Notification */}
        {alertToast && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-rose-950/95 border border-rose-500/50 shadow-2xl text-left max-w-sm animate-bounce space-y-1">
            <div className="flex items-center justify-between">
              <strong className="text-xs font-bold text-rose-300 font-mono uppercase">{alertToast.title}</strong>
              <button onClick={() => setAlertModalOpen(true)} className="text-[10px] text-amber-400 font-bold hover:underline cursor-pointer">View Alert &rarr;</button>
            </div>
            <p className="text-[11px] text-slate-200 font-sans leading-tight">{alertToast.msg}</p>
          </div>
        )}

        <AlertCenterModal
          isOpen={alertModalOpen}
          onClose={() => setAlertModalOpen(false)}
        />
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
