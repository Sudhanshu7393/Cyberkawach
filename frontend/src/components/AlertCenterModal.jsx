import React, { useState } from 'react';
import { Mail, MessageSquare, ShieldAlert, CheckCircle2, X, ExternalLink, Settings, RefreshCw, Trash2, BellRing, Sparkles } from 'lucide-react';

export default function AlertCenterModal({ 
  isOpen, 
  onClose, 
  alerts = [], 
  onClearAlerts,
  config = { recipientEmail: 'victim_account@cyberkawach.org', recipientPhone: '+91 98765 43210', autoDispatch: true },
  onSaveConfig
}) {
  const [localConfig, setLocalConfig] = useState(config);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    if (onSaveConfig) {
      onSaveConfig(localConfig);
    }
    setSaveSuccess('Target contact updated! Future anomalies will automatically dispatch to this address.');
    setTimeout(() => {
      setSaveSuccess(null);
      setIsSaving(false);
    }, 2500);
  };

  const handleViewEmail = (alt) => {
    if (alt.previewUrl) {
      window.open(alt.previewUrl, '_blank');
    } else if (alt.previewHtml) {
      const blob = new Blob([alt.previewHtml], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#090D16] border border-white/[0.1] rounded-3xl shadow-2xl p-6 sm:p-7 space-y-6 text-left max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                <span>Automated Incident Response & Alert Ledger</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ZERO-TOUCH AUTO DISPATCH</span>
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                Triggered automatically by Isolation Forest whenever a session risk score &gt; 60.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target User Contact Settings */}
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-[#0E1422] border border-white/[0.06] space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 font-mono uppercase flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>Target Victim Notification Address</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Active Defense
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Recipient Email Address:
              </label>
              <input
                type="email"
                value={localConfig.recipientEmail}
                onChange={(e) => setLocalConfig({ ...localConfig, recipientEmail: e.target.value })}
                className="w-full bg-[#080C14] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400 transition"
                placeholder="victim_account@cyberkawach.org"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Recipient Phone / SMS:
              </label>
              <input
                type="text"
                value={localConfig.recipientPhone}
                onChange={(e) => setLocalConfig({ ...localConfig, recipientPhone: e.target.value })}
                className="w-full bg-[#080C14] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400 transition"
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <span className="text-[11px] text-slate-400 font-sans">
              Whenever an intrusion is isolated, CyberKawach automatically sends an alert to this address.
            </span>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-tactile px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs font-sans transition cursor-pointer disabled:opacity-50 self-end sm:self-auto shadow-sm"
            >
              {isSaving ? 'Updating...' : 'Save Contact'}
            </button>
          </div>

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-sans flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{saveSuccess}</span>
            </div>
          )}
        </form>

        {/* Real-time Automatically Dispatched Alerts Ledger */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <span>Auto-Dispatched Security Incidents ({alerts.length})</span>
            </span>
            {alerts.length > 0 && onClearAlerts && (
              <button
                type="button"
                onClick={onClearAlerts}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-mono cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Ledger</span>
              </button>
            )}
          </div>

          {alerts.length === 0 ? (
            <div className="p-8 text-center text-xs font-sans text-slate-400 border border-dashed border-white/[0.08] rounded-2xl space-y-1">
              <span className="block text-slate-300 font-semibold">No active security incidents dispatched yet.</span>
              <span>Trigger an intrusion scenario on the dashboard &mdash; CyberKawach will instantly record and dispatch the alert here.</span>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {alerts.map((alt) => (
                <div key={alt.id} className="p-4 rounded-2xl bg-[#0E1422] border border-white/[0.06] space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                        🚨 DISPATCHED (RISK {alt.riskScore})
                      </span>
                      <strong className="text-white font-mono">{alt.userId}</strong>
                      <span className="text-slate-400 text-[11px] font-mono">({alt.ipAddress} &bull; {alt.country})</span>
                    </div>
                    <span className="text-slate-500 text-[10px] font-mono">
                      {new Date(alt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-sans">
                    Threat Vector: <span className="text-amber-400 font-semibold">{alt.threatVector}</span>
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.06] text-[11px] font-mono">
                    <div className="flex items-center gap-3 text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <Mail className="w-3 h-3" />
                        <span>Email Sent</span>
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <MessageSquare className="w-3 h-3" />
                        <span>SMS Sent</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleViewEmail(alt)}
                      className="btn-tactile px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span>View Formatted Email HTML</span>
                      <ExternalLink className="w-3 h-3 text-amber-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
