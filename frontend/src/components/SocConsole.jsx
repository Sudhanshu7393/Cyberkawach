import React, { useState } from 'react';
import {
  Play,
  Flame,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileSpreadsheet,
  Trash2,
  Cpu,
  Zap,
  Radio,
  Clock,
  Filter,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCircle2,
  Sparkles,
  Server,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import TimelineChart from './TimelineChart';

export default function SocConsole({
  stats,
  logs,
  onGenerateSample,
  onClearLogs,
  isGenerating,
  isClearing,
  activeFilter,
  setActiveFilter,
  onRefresh,
  liveStreamActive,
  setLiveStreamActive,
  onTriggerScenario
}) {
  const [selectedLogId, setSelectedLogId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const scenarioButtons = [
    { 
      id: 'normal', 
      name: 'Peaceful User Session', 
      tag: 'Legitimate', 
      desc: '14.5MB browsing docs at 2:00 PM', 
      type: 'safe',
      icon: ShieldCheck
    },
    { 
      id: 'bruteforce', 
      name: 'Credential Spray Attack', 
      tag: 'Intrusion', 
      desc: '18 failed logins at 3:00 AM (RU proxy)', 
      type: 'danger',
      icon: Flame
    },
    { 
      id: 'exfiltration', 
      name: '6.2GB Data Exfiltration', 
      tag: 'Data Leak', 
      desc: 'Severe off-hours upload spike to CN', 
      type: 'danger',
      icon: AlertTriangle
    },
    { 
      id: 'ddos', 
      name: 'SYN Flood / Bot Burst', 
      tag: 'DoS Flood', 
      desc: '2,100 req/min synthetic bot stream', 
      type: 'danger',
      icon: Zap
    }
  ];

  const handleCopyJson = (log) => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCsv = () => {
    if (!logs || logs.length === 0) return alert('No logs available to export yet. Generate some telemetry first.');
    const headers = ['ID', 'User_ID', 'IP_Address', 'Country', 'Login_Hour', 'Download_MB', 'Upload_MB', 'Failed_Logins', 'Requests_Per_Min', 'Risk_Score', 'Is_Anomaly', 'Root_Cause', 'Timestamp'];
    const rows = logs.map(l => [
      l.id,
      l.user_id,
      l.ip_address,
      l.country || 'IN',
      l.login_hour || 12,
      l.download_mb || 0,
      l.upload_mb || 0,
      l.failed_login_count || 0,
      l.requests_per_minute || 0,
      l.ml_inference?.risk_score ?? l.risk_score ?? 0,
      l.ml_inference?.is_anomaly ?? l.is_anomaly ?? false,
      `"${(l.ml_inference?.root_cause || l.root_cause || '').replace(/"/g, '""')}"`,
      l.timestamp
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cyberkawach_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="soc-console" className="space-y-8 text-left font-sans">
      
      {/* 1. Attack Scenario Trigger Dock */}
      <div className="p-6 sm:p-7 rounded-3xl glass-panel space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Zap className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-white font-sans">
                Interactive Attack Simulation Dock
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Test how the unsupervised Isolation Forest behaves when encountering synthetic intrusions.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onGenerateSample(8, 0.25)}
              disabled={isGenerating}
              className="btn-tactile px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-white/[0.08] transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>{isGenerating ? 'Injecting Packets...' : '+ Ingest 8 Packets'}</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="btn-tactile px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-400 text-xs font-mono border border-white/[0.08] transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Interactive Simulation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          {scenarioButtons.map((sc) => {
            const Icon = sc.icon;
            const isSafe = sc.type === 'safe';
            return (
              <button
                key={sc.id}
                onClick={() => onTriggerScenario && onTriggerScenario(sc.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-3 ${
                  isSafe
                    ? 'bg-[#0A1019]/90 hover:bg-[#0E1624] border-emerald-500/25 hover:border-emerald-500/50 shadow-sm'
                    : 'bg-[#0A1019]/90 hover:bg-[#150E18] border-rose-500/25 hover:border-rose-500/50 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                      isSafe 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}>
                      {sc.tag}
                    </span>
                    <span className="p-1 rounded-lg bg-slate-800/60 text-slate-400 group-hover:text-white transition-colors">
                      <Play className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                  <span className="text-xs font-bold text-white block group-hover:text-amber-400 transition-colors">
                    {sc.name}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block font-sans leading-tight">
                  {sc.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Timeline Graph & Activity Stream */}
      <div className="p-6 sm:p-7 rounded-3xl glass-panel space-y-6">
        
        {/* Timeline Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Real-Time Anomaly Waveform & Ingress Feed</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuously parsing 7 flow dimensions across active network connections.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-white/[0.08] text-xs font-mono">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Flows ({logs.length})
              </button>
              <button
                onClick={() => setActiveFilter('anomalies')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === 'anomalies'
                    ? 'bg-rose-500 text-white font-bold'
                    : 'text-slate-400 hover:text-rose-400'
                }`}
              >
                <span>Anomalies Only</span>
                {stats?.anomalies_detected > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                )}
              </button>
            </div>

            <button
              onClick={onClearLogs}
              disabled={isClearing || logs.length === 0}
              title="Reset telemetry ledger"
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/[0.08] hover:border-rose-500/30 transition cursor-pointer disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Detailed Timeline Waveform Canvas */}
        <div className="p-4 rounded-2xl bg-[#080C14]/90 border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Anomaly Risk Score Curve (0 = Normal, 100 = Critical Intrusion)</span>
            </span>
            <span className="text-[11px] text-slate-500">Last 15 Observations</span>
          </div>
          <div className="w-full h-44">
            <TimelineChart timelineData={stats?.timeline || []} isMini={false} />
          </div>
        </div>

        {/* Telemetry Table */}
        {logs.length === 0 ? (
          /* Humanized Empty State */
          <div className="text-center py-14 px-4 rounded-2xl bg-[#080C14]/50 border border-dashed border-white/[0.08] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-sans">
                Telemetry Radar is in Standby Mode
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 font-sans leading-relaxed">
                No network packets parsed yet. Click <strong>"Start Live Network Stream"</strong> or trigger an attack scenario above to observe real-time Isolation Forest evaluation.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setLiveStreamActive(true)}
                className="btn-tactile px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs font-sans shadow-md hover:from-amber-400 hover:to-amber-500 cursor-pointer inline-flex items-center gap-2"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Start Live Ingress Stream</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-[#080C14]/80">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 uppercase text-[11px] bg-slate-900/60">
                  <th className="py-3 px-4">Evaluation</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Source IP</th>
                  <th className="py-3 px-4">Risk Metric</th>
                  <th className="py-3 px-4">Primary Anomaly Reason</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4 text-right">Forensics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-slate-300">
                {logs.map((log) => {
                  const isAnomaly = log.ml_inference?.is_anomaly || log.is_anomaly;
                  const score = log.ml_inference?.risk_score ?? log.risk_score ?? 10;
                  const reason = log.ml_inference?.root_cause || log.root_cause || (isAnomaly ? 'Off-hours flow deviation' : 'Normal baseline session');
                  const isExpanded = selectedLogId === log.id;

                  return (
                    <React.Fragment key={log.id}>
                      <tr 
                        onClick={() => setSelectedLogId(isExpanded ? null : log.id)}
                        className={`hover:bg-slate-800/40 transition cursor-pointer ${
                          isExpanded ? 'bg-slate-800/60' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border inline-flex items-center gap-1 ${
                            isAnomaly
                              ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isAnomaly ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                            <span>{isAnomaly ? 'ANOMALY' : 'NORMAL'}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">{log.user_id}</td>
                        <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                          <span>{log.ip_address}</span>
                          {log.country && (
                            <span className="ml-1.5 text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                              {log.country}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-bold whitespace-nowrap">
                          <span className={score >= 50 ? 'text-rose-400' : 'text-emerald-400'}>
                            {score} <span className="text-[10px] text-slate-500">/ 100</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate font-sans text-xs">
                          {reason}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button className="p-1 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white transition">
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Forensic Breakdown */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="p-0 bg-[#090D16] border-y border-amber-500/25">
                            <div className="p-6 space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
                                <div>
                                  <span className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Forensic Vector Matrix &bull; {log.user_id}</span>
                                  </span>
                                  <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                                    7 dimensions analyzed by recursive tree partitioning
                                  </span>
                                </div>

                                <button
                                  onClick={(e) => { e.stopPropagation(); handleCopyJson(log); }}
                                  className="btn-tactile px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-white/[0.08] flex items-center gap-1.5 transition cursor-pointer self-start"
                                >
                                  {copiedId === log.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>{copiedId === log.id ? 'Copied to Clipboard!' : 'Copy Telemetry JSON'}</span>
                                </button>
                              </div>

                              {/* 7 Feature Grid */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 font-mono text-center">
                                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/[0.06]">
                                  <span className="text-[10px] text-slate-400 block uppercase font-sans">Login Hour</span>
                                  <span className="text-sm font-bold text-white">{log.login_hour ?? 12}:00</span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/[0.06]">
                                  <span className="text-[10px] text-slate-400 block uppercase font-sans">Download</span>
                                  <span className="text-sm font-bold text-white">{log.download_mb ?? 0} MB</span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/[0.06]">
                                  <span className="text-[10px] text-slate-400 block uppercase font-sans">Upload</span>
                                  <span className={`text-sm font-bold ${(log.upload_mb || 0) > 1000 ? 'text-rose-400 font-extrabold' : 'text-white'}`}>
                                    {log.upload_mb ?? 0} MB
                                  </span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/[0.06]">
                                  <span className="text-[10px] text-slate-400 block uppercase font-sans">Duration</span>
                                  <span className="text-sm font-bold text-white">{log.session_duration_sec ?? 0}s</span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/[0.06]">
                                  <span className="text-[10px] text-slate-400 block uppercase font-sans">Failed Passwords</span>
                                  <span className={`text-sm font-bold ${(log.failed_login_count || 0) > 3 ? 'text-rose-400 font-extrabold' : 'text-white'}`}>
                                    {log.failed_login_count ?? 0}
                                  </span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/[0.06]">
                                  <span className="text-[10px] text-slate-400 block uppercase font-sans">Req Rate/Min</span>
                                  <span className={`text-sm font-bold ${(log.requests_per_minute || 0) > 500 ? 'text-rose-400 font-extrabold' : 'text-white'}`}>
                                    {log.requests_per_minute ?? 0}
                                  </span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/[0.06]">
                                  <span className="text-[10px] text-slate-400 block uppercase font-sans">Geo Delta</span>
                                  <span className={`text-sm font-bold ${log.country_change_flag ? 'text-amber-400' : 'text-emerald-400'}`}>
                                    {log.country_change_flag ? 'Changed' : 'Same'}
                                  </span>
                                </div>
                              </div>

                              {/* Forensic Summary Alert Note */}
                              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.06] text-xs text-slate-300 font-sans flex items-start gap-2.5">
                                <Cpu className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="text-white block font-semibold">Isolation Explanation:</strong>
                                  <span className="text-slate-400">{reason}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
