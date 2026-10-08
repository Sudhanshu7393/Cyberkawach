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
  CheckCircle2
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
    { id: 'normal', name: 'Safe Session (HTTP/80)', desc: '14.5MB browsing at 2PM', type: 'safe' },
    { id: 'bruteforce', name: 'Auth Brute-Force Spray', desc: '18 failed logins at 3AM', type: 'danger' },
    { id: 'exfiltration', name: '6.2GB Data Exfil Spike', desc: 'Off-hours upload spike', type: 'danger' },
    { id: 'ddos', name: 'SYN Flood / Bot Burst', desc: '2,100 req/min burst', type: 'danger' }
  ];

  const handleCopyJson = (log) => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCsv = () => {
    if (!logs || logs.length === 0) return alert('No logs to export');
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
    link.setAttribute('download', `network_incident_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="soc-console" className="space-y-8 text-left font-sans">
      {/* 1. Attack Scenario Trigger Dock */}
      <div className="p-6 rounded-3xl bg-[#151D2A] border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Simulate Network Traffic Scenarios</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Inject synthetic flow vectors into the live Isolation Forest pipeline.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onGenerateSample(8, 0.25)}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? 'Injecting 8 Packets...' : '+ Ingest 8 Packets'}
            </button>
            <button
              onClick={handleExportCsv}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-mono border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {scenarioButtons.map((sc) => (
            <button
              key={sc.id}
              onClick={() => onTriggerScenario && onTriggerScenario(sc.id)}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                sc.type === 'safe'
                  ? 'bg-[#0D1117] hover:bg-[#111722] border-emerald-500/30 hover:border-emerald-500/60'
                  : 'bg-[#0D1117] hover:bg-[#111722] border-rose-500/30 hover:border-rose-500/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold font-mono ${sc.type === 'safe' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {sc.name}
                </span>
                <Play className="w-3 h-3 text-slate-400" />
              </div>
              <span className="text-[11px] text-slate-400 block font-sans">{sc.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Timeline Graph */}
      <div className="p-6 rounded-3xl bg-[#151D2A] border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Real-Time Network Flow Risk Timeline</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Anomaly score distribution over sequential session timestamps.
            </p>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <TimelineChart timelineData={stats?.timeline || []} />
        </div>
      </div>

      {/* 3. Live Telemetry Logs Table */}
      <div className="p-6 rounded-3xl bg-[#151D2A] border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Classified Network Session Logs</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Click any log row below to inspect its <strong>full 7-feature forensic breakdown & root cause</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter */}
            <div className="inline-flex rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs font-mono">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
                }`}
              >
                All Flows
              </button>
              <button
                onClick={() => setActiveFilter('anomalies')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeFilter === 'anomalies' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-slate-400'
                }`}
              >
                Anomalies Only
              </button>
            </div>

            {logs.length > 0 && (
              <button
                onClick={onClearLogs}
                disabled={isClearing}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 transition cursor-pointer"
                title="Clear Logs"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {logs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs font-mono border border-dashed border-slate-800 rounded-2xl">
            No network logs in feed. Click "+ Ingest 8 Packets" or trigger a scenario above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                  <th className="py-2.5 px-3">Verdict</th>
                  <th className="py-2.5 px-3">User ID</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3">Risk Score</th>
                  <th className="py-2.5 px-3">Primary Root Cause</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {logs.map((log) => {
                  const isAnomaly = log.ml_inference?.is_anomaly || log.is_anomaly;
                  const score = log.ml_inference?.risk_score ?? log.risk_score;
                  const reason = log.ml_inference?.root_cause || log.root_cause || (isAnomaly ? 'Statistical flow deviation' : 'Normal baseline session');
                  const isExpanded = selectedLogId === log.id;

                  return (
                    <React.Fragment key={log.id}>
                      <tr 
                        onClick={() => setSelectedLogId(isExpanded ? null : log.id)}
                        className={`hover:bg-slate-800/40 transition cursor-pointer ${
                          isExpanded ? 'bg-slate-800/50' : ''
                        }`}
                      >
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${
                            isAnomaly
                              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          }`}>
                            {isAnomaly ? '🚨 ANOMALY' : '✓ SAFE'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-white">{log.user_id}</td>
                        <td className="py-3 px-3 text-slate-400">{log.ip_address}</td>
                        <td className="py-3 px-3 font-bold">
                          <span className={score >= 50 ? 'text-rose-400' : 'text-emerald-400'}>
                            {score} <span className="text-[10px] text-slate-500">/ 100</span>
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-300 max-w-xs truncate">{reason}</td>
                        <td className="py-3 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button className="p-1 rounded bg-slate-800 text-slate-300 hover:text-amber-400 transition">
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Forensic Breakdown */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="p-0 bg-[#0D1117] border-y border-amber-500/20">
                            <div className="p-5 space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                                  Forensic Vector Matrix &bull; {log.user_id}
                                </span>

                                <button
                                  onClick={(e) => { e.stopPropagation(); handleCopyJson(log); }}
                                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                                >
                                  {copiedId === log.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>{copiedId === log.id ? 'JSON Copied!' : 'Copy Telemetry JSON'}</span>
                                </button>
                              </div>

                              {/* 7 Feature Vector Matrix */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                <div className="p-3 rounded-xl bg-[#151D2A] border border-slate-800">
                                  <span className="text-[10px] text-slate-400 block uppercase">1. Access Hour</span>
                                  <span className="text-white font-bold">{log.login_hour ?? 14}:00 hrs</span>
                                </div>
                                <div className="p-3 rounded-xl bg-[#151D2A] border border-slate-800">
                                  <span className="text-[10px] text-slate-400 block uppercase">2. Country Origin</span>
                                  <span className="text-white font-bold">{log.country || 'IN'} {log.country_change_flag ? '(Origin Shift)' : '(Standard)'}</span>
                                </div>
                                <div className="p-3 rounded-xl bg-[#151D2A] border border-slate-800">
                                  <span className="text-[10px] text-slate-400 block uppercase">3. Download Volume</span>
                                  <span className="text-white font-bold">{log.download_mb ?? 0} MB</span>
                                </div>
                                <div className="p-3 rounded-xl bg-[#151D2A] border border-slate-800">
                                  <span className="text-[10px] text-slate-400 block uppercase">4. Upload Volume</span>
                                  <span className={`font-bold ${(log.upload_mb || 0) > 1000 ? 'text-rose-400' : 'text-white'}`}>{log.upload_mb ?? 0} MB</span>
                                </div>
                                <div className="p-3 rounded-xl bg-[#151D2A] border border-slate-800">
                                  <span className="text-[10px] text-slate-400 block uppercase">5. Session Duration</span>
                                  <span className="text-white font-bold">{log.session_duration_sec ?? 0} sec</span>
                                </div>
                                <div className="p-3 rounded-xl bg-[#151D2A] border border-slate-800">
                                  <span className="text-[10px] text-slate-400 block uppercase">6. Failed Logins</span>
                                  <span className={`font-bold ${(log.failed_login_count || 0) > 3 ? 'text-rose-400' : 'text-emerald-400'}`}>{log.failed_login_count ?? 0} attempts</span>
                                </div>
                                <div className="p-3 rounded-xl bg-[#151D2A] border border-slate-800">
                                  <span className="text-[10px] text-slate-400 block uppercase">7. Request Rate</span>
                                  <span className={`font-bold ${(log.requests_per_minute || 0) > 300 ? 'text-rose-400' : 'text-white'}`}>{log.requests_per_minute ?? 0} req/min</span>
                                </div>
                                <div className="p-3 rounded-xl bg-[#151D2A] border border-slate-800">
                                  <span className="text-[10px] text-slate-400 block uppercase">Client Device</span>
                                  <span className="text-slate-300 font-semibold truncate block">{log.device || 'Workstation Node'}</span>
                                </div>
                              </div>

                              {/* Mitigation Banner */}
                              <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                                isAnomaly ? 'bg-rose-500/10 border-rose-500/30 text-rose-200' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                              }`}>
                                <div className="space-y-0.5 font-sans">
                                  <strong className="font-mono uppercase block text-[11px]">{isAnomaly ? 'Isolation Forest Threat Assessment' : 'Verified Safe Baseline'}</strong>
                                  <p className="text-slate-300">{reason}</p>
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
