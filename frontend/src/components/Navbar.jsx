import React, { useState } from 'react';
import CyberKawachLogo from './CyberKawachLogo';
import { Shield, Globe, Activity, RefreshCw, Radio, Menu, X } from 'lucide-react';

export default function Navbar({
  activeView,
  setActiveView,
  onRefresh,
  isRefreshing,
  liveStreamActive,
  setLiveStreamActive
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0B0F17]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* CyberKawach Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <CyberKawachLogo className="w-9 h-9 shrink-0 transition-transform group-hover:scale-105" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white tracking-tight font-sans">
                  Cyber<span className="text-amber-400">Kawach</span>
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-bold">
                  v1.2
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">
                Network & Webpage Security Platform
              </span>
            </div>
          </div>

          {/* Desktop Nav - 2 Core Tabs */}
          <nav className="hidden md:flex items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                activeView === 'home'
                  ? 'text-white bg-slate-800 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Network Anomaly Monitor (Layer 1)</span>
            </button>

            <button
              onClick={() => handleNavClick('url-scanner')}
              className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                activeView === 'url-scanner'
                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>URL Safety Scanner (Layer 2)</span>
            </button>
          </nav>

          {/* Right Controls */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh Telemetry"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => setLiveStreamActive(!liveStreamActive)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition border cursor-pointer ${
                liveStreamActive
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-amber-500 text-slate-950 border-amber-400 hover:bg-amber-400'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${liveStreamActive ? 'animate-ping' : ''}`} />
              <span>{liveStreamActive ? 'Streaming Active ⏸' : 'Live Stream'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800 border border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-800 space-y-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                activeView === 'home' ? 'text-white bg-slate-800' : 'text-slate-400'
              }`}
            >
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Network Anomaly Monitor (Layer 1)</span>
            </button>
            <button
              onClick={() => handleNavClick('url-scanner')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                activeView === 'url-scanner' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
              }`}
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>URL Safety Scanner (Layer 2)</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
