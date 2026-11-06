import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MetricsBar from './components/MetricsBar';
import ArchitectureMathSection from './components/ArchitectureMathSection';
import SocConsole from './components/SocConsole';
import UrlScanner from './pages/UrlScanner';
import AlertCenterModal from './components/AlertCenterModal';
import CyberKawachLogo from './components/CyberKawachLogo';
import { generateRandomPacket, evaluateFlowClient, createAlertRecord } from './utils/engine';
import { ShieldAlert, X, ArrowRight } from 'lucide-react';

const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

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
  const [alerts, setAlerts] = useState([]);
  const [alertCount, setAlertCount] = useState(0);
  const [alertToast, setAlertToast] = useState(null);
  const [alertConfig, setAlertConfig] = useState({
    recipientEmail: 'victim_account@cyberkawach.org',
    recipientPhone: '+91 98765 43210',
    autoDispatch: true
  });

  const streamIntervalRef = useRef(null);

  // Recalculate stats dynamically from client logs
  const computeStatsFromLogs = (logList) => {
    const total = logList.length;
    const anomalies = logList.filter(l => l.is_anomaly || l.ml_inference?.is_anomaly).length;
    const normal = total - anomalies;
    const percentage = total > 0 ? ((anomalies / total) * 100).toFixed(1) : '0.0';

    const timeline = logList.slice(0, 15).reverse().map((l) => ({
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

  const triggerAlertNotification = (payload) => {
    const newAlert = createAlertRecord(payload, alertConfig.recipientEmail, alertConfig.recipientPhone);
    setAlerts(prev => [newAlert, ...prev]);
    setAlertCount(c => c + 1);

    setAlertToast({
      title: '🚨 Critical Intrusion Isolated',
      msg: `Security warning dispatched for IP ${payload.ip_address} (${payload.country || 'Unknown'})`
    });
    setTimeout(() => setAlertToast(null), 5500);

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 CyberKawach Security Alert', {
        body: `Unauthorized attack detected on ID ${payload.user_id} from ${payload.ip_address}. Account protected.`
      });
    } else if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  const fetchData = useCallback(async () => {
    if (!isLocalhost) {
      // On Vercel / production, client-side state is source of truth
      return;
    }
    setIsRefreshing(true);
    try {
      const [statsRes, logsRes] = await Promise.all([
        axios.get('/api/predictions/stats', { timeout: 2000 }),
        axios.get(`/api/predictions?limit=50&anomaly=${activeFilter === 'anomalies'}`, { timeout: 2000 })
      ]);

      if (statsRes.data && typeof statsRes.data === 'object' && statsRes.data.data) {
        setStats(statsRes.data.data);
      }
      if (logsRes.data && typeof logsRes.data === 'object' && logsRes.data.data) {
        setLogs(logsRes.data.data);
      }

      try {
        const altRes = await axios.get('/api/alerts/history', { timeout: 1500 });
        if (altRes.data?.alerts && Array.isArray(altRes.data.alerts)) {
          setAlerts(altRes.data.alerts);
          setAlertCount(altRes.data.alerts.length);
        }
      } catch (e) {}
    } catch (err) {
      // Backend offline
    } finally {
      setIsRefreshing(false);
    }
  }, [activeFilter]);

  // Clean dashboard on initial page load
  useEffect(() => {
    setLogs([]);
    setStats({
      total_activities: 0,
      anomalies_detected: 0,
      normal_activities: 0,
      anomaly_percentage: '0.0',
      timeline: []
    });
    setAlerts([]);
    setAlertCount(0);

    if (isLocalhost) {
      axios.post('/api/predictions/clear', {}, { timeout: 1500 }).catch(() => {});
    }
  }, []);

  // Poll backend if running on localhost
  useEffect(() => {
    if (!isLocalhost) return;
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Live Stream Handler (100% Autonomous on any device & Vercel)
  useEffect(() => {
    if (liveStreamActive) {
      streamIntervalRef.current = setInterval(async () => {
        if (isLocalhost) {
          try {
            const res = await axios.post('/api/logs/generate-sample?count=1&ratio=0.25', {}, { timeout: 2000 });
            if (res.data && typeof res.data === 'object' && res.data.success) {
              fetchData();
              return;
            }
          } catch (err) {
            // Backend offline -> run client engine
          }
        }

        // Autonomous generation
        const packet = generateRandomPacket();
        setLogs(prev => {
          const nextLogs = [packet, ...prev].slice(0, 50);
          setStats(computeStatsFromLogs(nextLogs));
          return nextLogs;
        });

        if (packet.is_anomaly) {
          triggerAlertNotification(packet);
        }
      }, 2500);
    } else {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    }

    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, [liveStreamActive, fetchData, alertConfig]);

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

    if (isLocalhost) {
      try {
        const res = await axios.post('/api/logs/upload', payload, { timeout: 2500 });
        if (res.data && typeof res.data === 'object' && res.data.success) {
          await fetchData();
          if (res.data?.ml_inference?.is_anomaly) {
            triggerAlertNotification(payload);
          }
          return res.data;
        }
      } catch (err) {
        // Fall back to client evaluation
      }
    }

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
      triggerAlertNotification(payload);
    }
    return { success: true, data: payload, ml_inference: inference };
  };

  const handleGenerateSample = async (count = 8, ratio = 0.25) => {
    setIsGenerating(true);
    if (isLocalhost) {
      try {
        const res = await axios.post(`/api/logs/generate-sample?count=${count}&ratio=${ratio}`, {}, { timeout: 2500 });
        if (res.data && typeof res.data === 'object' && res.data.success) {
          await fetchData();
          setIsGenerating(false);
          return;
        }
      } catch (err) {
        // Fall through
      }
    }

    // Generate client-side samples
    const packets = [];
    const newAlerts = [];
    for (let i = 0; i < count; i++) {
      const pkt = generateRandomPacket();
      packets.push(pkt);
      if (pkt.is_anomaly) {
        newAlerts.push(createAlertRecord(pkt, alertConfig.recipientEmail, alertConfig.recipientPhone));
      }
    }
    setLogs(prev => {
      const nextLogs = [...packets, ...prev].slice(0, 50);
      setStats(computeStatsFromLogs(nextLogs));
      return nextLogs;
    });

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev]);
      setAlertCount(c => c + newAlerts.length);
      setAlertToast({
        title: `🚨 ${newAlerts.length} Anomaly Dispatches`,
        msg: `${newAlerts.length} high-risk deviation flow(s) flagged and recorded.`
      });
      setTimeout(() => setAlertToast(null), 4500);
    }
    setIsGenerating(false);
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Clear all stored telemetry predictions?')) return;
    setIsClearing(true);
    if (isLocalhost) {
      try {
        await axios.post('/api/predictions/clear', {}, { timeout: 2000 });
      } catch (err) {}
    }
    setLogs([]);
    setStats({
      total_activities: 0,
      anomalies_detected: 0,
      normal_activities: 0,
      anomaly_percentage: '0.0',
      timeline: []
    });
    setAlerts([]);
    setAlertCount(0);
    setIsClearing(false);
  };

  const displayedLogs = activeFilter === 'anomalies'
    ? logs.filter(l => l.is_anomaly || l.ml_inference?.is_anomaly)
    : logs;

  return (
    <div className="min-h-screen text-slate-300 relative font-sans overflow-x-hidden selection:bg-amber-500/20 selection:text-amber-300 bg-[#060911]">
      
      {/* Top Navbar */}
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
          <div className="space-y-12 sm:space-y-16">
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
              logs={displayedLogs}
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

        {/* Real-Time Alert Toast Notification (Senior Designer Glass Pill) */}
        {alertToast && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#160B12]/95 border border-rose-500/40 shadow-2xl shadow-rose-950/60 backdrop-blur-xl text-left max-w-sm space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-rose-500/20 text-rose-400">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </span>
                <strong className="text-xs font-bold text-rose-300 font-sans tracking-wide">
                  {alertToast.title}
                </strong>
              </div>
              <button 
                onClick={() => setAlertToast(null)} 
                className="text-slate-400 hover:text-white transition p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {alertToast.msg}
            </p>

            <div className="pt-1 flex justify-end">
              <button 
                onClick={() => {
                  setAlertToast(null);
                  setAlertModalOpen(true);
                }} 
                className="text-xs text-amber-400 font-semibold hover:text-amber-300 cursor-pointer flex items-center gap-1 font-sans"
              >
                <span>View Dispatched Alert</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <AlertCenterModal
          isOpen={alertModalOpen}
          onClose={() => setAlertModalOpen(false)}
          alerts={alerts}
          onClearAlerts={() => {
            setAlerts([]);
            setAlertCount(0);
          }}
          config={alertConfig}
          onSaveConfig={(cfg) => setAlertConfig(cfg)}
        />
      </main>

      {/* Modern Cybersecurity Production Footer */}
      <footer className="border-t border-white/[0.07] bg-[#070A12]/90 backdrop-blur-xl py-10 mt-20 text-xs text-slate-400 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CyberKawachLogo className="w-7 h-7 shrink-0" />
              <span className="text-sm font-bold text-white tracking-tight">CyberKawach</span>
              <span className="text-[10px] font-mono tracking-wide px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-semibold">
                Dual-Layer Active Defense
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
              <span>Layer 1: Isolation Forest</span>
              <span>&bull;</span>
              <span>Layer 2: URL Classifier</span>
              <span>&bull;</span>
              <span className="text-emerald-400 font-medium">● All Services Online</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[11px] font-mono">
            <div>
              Network Anomaly Detection & Webpage Threat Classification Platform
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
