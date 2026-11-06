import React, { useState } from 'react';
import CyberKawachLogo from './CyberKawachLogo';
import { Shield, Globe, Activity, RefreshCw, Radio, Menu, X, Bell, Sparkles } from 'lucide-react';

export default function Navbar({
  activeView,
  setActiveView,
  onRefresh,
  isRefreshing,
  liveStreamActive,
  onOpenAlerts,
  alertCount = 0,
  setLiveStreamActive
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#070A12]/80 backdrop-blur-2xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Humanized Status */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 cursor-pointer group select-none shrink-0"
          >
            <div className="relative">
              <CyberKawachLogo className="w-10 h-10 shrink-0 transition-transform duration-300 group-hover:scale-105" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#070A12] ring-2 ring-emerald-500/20 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight font-sans">
                  Cyber<span className="text-amber-400">Kawach</span>
                </span>
                <span className="text-[10px] font-mono tracking-wide px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-semibold">
                  Dual-Layer Active
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:block font-sans font-medium">
                Intelligent Anomaly Detection & URL Defense
              </span>
            </div>
          </div>

          {/* Desktop Navigation - Human-friendly Tab Switcher */}
          <nav className="hidden md:flex items-center p-1 rounded-2xl bg-slate-900/60 border border-white/[0.08] shadow-inner text-xs font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                activeView === 'home'
                  ? 'text-white bg-slate-800/90 shadow-sm border border-white/10 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Activity className={`w-4 h-4 ${activeView === 'home' ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>Layer 1: Network Flow Monitor</span>
            </button>

            <button
              onClick={() => handleNavClick('url-scanner')}
              className={`px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                activeView === 'url-scanner'
                  ? 'text-white bg-slate-800/90 shadow-sm border border-white/10 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Globe className={`w-4 h-4 ${activeView === 'url-scanner' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>Layer 2: URL Safety Scanner</span>
            </button>
          </nav>

          {/* Right Controls - Action Dock */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Incident Alert Ledger Button */}
            <button
              onClick={onOpenAlerts}
              title="View Automated Incident Response Ledger"
              className="btn-tactile px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/[0.08] hover:border-rose-500/40 text-xs font-sans font-semibold transition flex items-center gap-2 relative cursor-pointer group"
            >
              <div className="relative">
                <Bell className="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors" />
                {alertCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </div>
              <span className="group-hover:text-white transition-colors">Alerts</span>
              {alertCount > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold">
                  {alertCount}
                </span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="All clear" />
              )}
            </button>

            {/* Refresh Telemetry */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh Telemetry Feed"
              className="btn-tactile p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/[0.08] transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            </button>

            {/* Live Stream Main CTA */}
            <button
              onClick={() => setLiveStreamActive(!liveStreamActive)}
              className={`btn-tactile flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                liveStreamActive
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-rose-950/40 animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 border border-amber-400/50 shadow-amber-500/10'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${liveStreamActive ? 'animate-ping' : ''}`} />
              <span>{liveStreamActive ? 'Pause Stream' : 'Live Stream'}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenAlerts}
              className="p-2 rounded-xl bg-slate-900 text-slate-300 border border-white/[0.08] relative"
            >
              <Bell className="w-4 h-4" />
              {alertCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-white/[0.08]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/[0.08] space-y-2 animate-in fade-in duration-200">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between ${
                activeView === 'home' 
                  ? 'text-white bg-slate-800 border border-white/10' 
                  : 'text-slate-400 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>Layer 1: Network Anomaly Monitor</span>
              </div>
              <span className="text-[10px] text-amber-400 font-mono">Isolation Forest</span>
            </button>

            <button
              onClick={() => handleNavClick('url-scanner')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between ${
                activeView === 'url-scanner' 
                  ? 'text-white bg-slate-800 border border-white/10' 
                  : 'text-slate-400 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Layer 2: URL Safety Scanner</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Entropy & Lexical</span>
            </button>

            <div className="pt-2">
              <button
                onClick={() => {
                  setLiveStreamActive(!liveStreamActive);
                  setMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold font-mono text-center flex items-center justify-center gap-2 ${
                  liveStreamActive
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-amber-500 text-slate-950 font-sans'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>{liveStreamActive ? 'Pause Ingress Stream' : 'Start Live Network Stream'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
