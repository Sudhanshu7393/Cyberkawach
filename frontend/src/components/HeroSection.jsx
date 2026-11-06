import React from 'react';
import { ArrowRight, Shield, Activity, Radio, Cpu, CheckCircle2, AlertTriangle, Globe, Sparkles, Zap } from 'lucide-react';
import TimelineChart from './TimelineChart';

export default function HeroSection({ onStartStream, liveStreamActive, stats, logs, onExploreUrlScanner }) {
  const totalSessions = stats?.total_activities || stats?.total_logs || logs?.length || 0;
  const anomaliesCount = stats?.anomalies_detected || 0;
  const anomalyRate = stats?.anomaly_percentage || '0.0';

  const isPeaceful = anomaliesCount === 0;

  return (
    <section className="pt-4 sm:pt-8 pb-10 sm:pb-14 text-left relative overflow-hidden">
      
      {/* Subtle ambient background glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Column: Human Story & Value Proposition */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/[0.08] shadow-sm text-xs font-sans text-slate-300">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${liveStreamActive ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${liveStreamActive ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            </span>
            <span className="font-medium text-slate-200">
              {liveStreamActive ? 'Real-Time Telemetry Stream Active' : 'Autonomous Defense Ready'}
            </span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-amber-400 font-mono text-[11px] font-semibold">Dual-Layer Architecture</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight leading-[1.18]">
              Intelligent Cyber Defense that <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                catches what firewalls miss.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
              CyberKawach monitors statistical flow patterns to isolate stealthy off-hours intrusions in sub-5ms—while shielding users from deceptive phishing lures and malicious web links.
            </p>
          </div>

          {/* Interactive Dual-Layer Visual Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="p-4 rounded-2xl glass-card-interactive border border-white/[0.06] space-y-1.5 group cursor-default">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Layer 1: Network Flow</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                  Isolation Forest
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Evaluates 7 behavioral flow dimensions to detect credential stuffing and massive exfiltration.
              </p>
            </div>

            <div 
              onClick={onExploreUrlScanner}
              className="p-4 rounded-2xl glass-card-interactive border border-white/[0.06] space-y-1.5 group cursor-pointer hover:border-emerald-500/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Layer 2: Web Threat Scanner</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold flex items-center gap-1">
                  <span>Open Scanner</span>
                  <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Computes Shannon Entropy and lexical deception markers to stop deceptive links before harm.
              </p>
            </div>
          </div>

          {/* Action Call to Action */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={onStartStream}
              className={`btn-tactile inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold tracking-tight transition cursor-pointer shadow-lg ${
                liveStreamActive
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-rose-950/40 animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border border-amber-400/60 hover:from-amber-400 hover:to-amber-500 shadow-amber-500/20'
              }`}
            >
              <Radio className={`w-4 h-4 ${liveStreamActive ? 'animate-ping' : ''}`} />
              <span>{liveStreamActive ? 'Pause Ingress Stream ⏸' : 'Start Live Network Stream'}</span>
            </button>

            <button
              onClick={onExploreUrlScanner}
              className="btn-tactile inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-white/[0.08] hover:border-white/20 transition cursor-pointer"
            >
              <span>Scan URLs (Layer 2)</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Right Column: Live Telemetry Radar Card */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-3xl glass-panel space-y-4">
            
            {/* Header: Status with Human Reassurance */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Live Telemetry Radar
                  </h3>
                  <span className="text-[11px] text-slate-400 block font-sans">
                    Statistical flow anomaly evaluation
                  </span>
                </div>
              </div>

              <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full font-bold border flex items-center gap-1.5 ${
                liveStreamActive 
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                  : 'bg-slate-800/80 text-slate-400 border-slate-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${liveStreamActive ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`} />
                <span>{liveStreamActive ? 'STREAMING' : 'IDLE'}</span>
              </span>
            </div>

            {/* Sparkline Waveform */}
            <div className="p-4 rounded-2xl bg-[#080C14]/90 border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Anomaly Risk Waveform</span>
                <span className="text-slate-300 font-semibold">{totalSessions} packets parsed</span>
              </div>
              <div className="w-full h-24">
                <TimelineChart timelineData={stats?.timeline || []} isMini={true} />
              </div>
            </div>

            {/* Quick Human-Readable Metrics Grid */}
            <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/[0.06]">
                <span className="text-[10px] text-slate-400 block uppercase font-sans">Parsed Flows</span>
                <span className="text-lg font-black text-white">{totalSessions}</span>
              </div>
              <div className={`p-3 rounded-2xl border transition-colors ${
                anomaliesCount > 0 
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-400' 
                  : 'bg-slate-900/60 border-white/[0.06] text-emerald-400'
              }`}>
                <span className="text-[10px] block uppercase font-sans opacity-80">Threats</span>
                <span className="text-lg font-black">{anomaliesCount}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/[0.06]">
                <span className="text-[10px] text-slate-400 block uppercase font-sans">Anomaly %</span>
                <span className="text-lg font-black text-amber-400">{anomalyRate}%</span>
              </div>
            </div>

            {/* Humanized Reassurance Footer */}
            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/[0.05] text-[11px] text-slate-400 flex items-center justify-between font-sans">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Status: {isPeaceful ? 'Normal baseline traffic' : `${anomaliesCount} anomalies isolated`}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Latency &lt; 5ms</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
