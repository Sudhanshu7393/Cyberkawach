import React, { useState } from 'react';
import { Mail, MessageSquare, ShieldAlert, CheckCircle2, X, ExternalLink, Settings, RefreshCw, Trash2 } from 'lucide-react';

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
    setSaveSuccess('Target contact updated! Future anomalies will auto-dispatch to this address.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0D1117] border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-6 text-left max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                <span>Automated Incident Response & Alert Ledger</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>100% AUTOMATIC DISPATCH</span>
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Triggered automatically by Isolation Forest whenever risk score &gt; 60.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target User Contact Settings */}
        <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-[#151D2A] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 font-mono uppercase flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>Target Victim Notification Address</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ⚡ Zero-Touch Auto Dispatch Active
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
                className="w-full bg-[#0D1117] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                placeholder="victim_account@cyberkawach.org"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Recipient SMS / Phone:
              </label>
              <input
                type="text"
                value={localConfig.recipientPhone}
                onChange={(e) => setLocalConfig({ ...localConfig, recipientPhone: e.target.value })}
                className="w-full bg-[#0D1117] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-400 font-mono">
              Jab bhi koi attack detect hoga, is email aur phone par auto-dispatch hoga.
            </span>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Updating...' : 'Save Contact'}
            </button>
          </div>

          {saveSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{saveSuccess}</span>
            </div>
          )}
        </form>

        {/* Real-time Automatically Dispatched Alerts Ledger */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <span>Auto-Dispatched Incidents ({alerts.length})</span>
            </span>
            {alerts.length > 0 && onClearAlerts && (
              <button
                type="button"
                onClick={onClearAlerts}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-mono cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Alert Ledger</span>
              </button>
            )}
          </div>

          {alerts.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-slate-500 border border-dashed border-slate-800 rounded-2xl">
              No anomalies detected yet. Trigger an attack scenario on the dashboard &mdash; system will automatically dispatch alerts here!
            </div>
          ) : (
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {alerts.map((alt) => (
                <div key={alt.id} className="p-3.5 rounded-2xl bg-[#151D2A] border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
                        🚨 AUTO-DISPATCHED (RISK {alt.riskScore})
                      </span>
                      <strong className="text-white font-mono">{alt.userId}</strong>
                      <span className="text-slate-400 text-[11px] font-mono">({alt.ipAddress} &bull; {alt.country})</span>
                    </div>
                    <span className="text-slate-500 text-[10px] font-mono">
                      {new Date(alt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 font-sans">
                    Threat Vector: <span className="text-amber-400 font-medium">{alt.threatVector}</span>
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-[11px] font-mono">
                    <div className="flex items-center gap-3 text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Mail className="w-3 h-3" />
                        <span>Email Sent: {alt.targetEmail}</span>
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <MessageSquare className="w-3 h-3" />
                        <span>SMS Sent: {alt.targetPhone}</span>
                      </span>
                    </div>

                    {(alt.previewUrl || alt.previewHtml) && (
                      <button
                        type="button"
                        onClick={() => handleViewEmail(alt)}
                        className="text-amber-400 hover:underline flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                      >
                        <span>View Real Email HTML ↗</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
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
