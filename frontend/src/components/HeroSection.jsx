import React from 'react';
import { ArrowRight, Shield, Activity, Radio, Cpu, CheckCircle2, AlertTriangle, Globe } from 'lucide-react';
import TimelineChart from './TimelineChart';

export default function HeroSection({ onStartStream, liveStreamActive, stats, logs, onExploreUrlScanner }) {
  const totalSessions = stats?.total_activities || stats?.total_logs || logs?.length || 0;
  const anomaliesCount = stats?.anomalies_detected || 0;
  const anomalyRate = stats?.anomaly_percentage || '0.0';

  return (
    <section className="pt-6 sm:pt-10 pb-12 text-left relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-5">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs font-mono text-amber-400 font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Dual-Layer Architecture &bull; 5th Sem Mini Project</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-[1.18]">
            Network Anomaly Detection & <br />
            <span className="text-amber-400 font-extrabold">Webpage Threat Classification</span>
          </h1>

          {/* Authentic Technical Subtitle */}
          <p className="text-sm sm:text-[15px] text-slate-300 font-normal leading-relaxed max-w-xl">
            A dual-layered machine learning platform. Evaluates statistical flow patterns using <strong>unsupervised Isolation Forest</strong> and analyzes URL lexical structures for <strong>safer browsing</strong>.
          </p>

          {/* Layer Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl cyber-card border border-slate-800">
              <span className="text-xs font-bold text-amber-400 font-mono block">Layer 1: Network Flow Monitor</span>
              <span className="text-xs text-slate-400 mt-0.5 block font-sans">Isolation Forest (7 Flow Dimensions)</span>
            </div>
            <div className="p-3.5 rounded-2xl cyber-card border border-slate-800">
              <span className="text-xs font-bold text-emerald-400 font-mono block">Layer 2: URL Safety Scanner</span>
              <span className="text-xs text-slate-400 mt-0.5 block font-sans">Lexical & Shannon Entropy Classifier</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onStartStream}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition cursor-pointer border shadow-md ${
                liveStreamActive
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400 hover:from-amber-400 hover:to-orange-400 font-bold'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>{liveStreamActive ? 'Pause Ingress Stream ⏸' : 'Start Live Network Stream'}</span>
            </button>

            <button
              onClick={onExploreUrlScanner}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-[#151D2A] hover:bg-[#1E293B] border border-slate-700 transition cursor-pointer"
            >
              <span>Scan URLs (Layer 2)</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Right Dashboard Live Telemetry Monitor Card */}
        <div className="lg:col-span-5">
          <div className="p-5 sm:p-6 rounded-3xl cyber-card border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Live Flow Waveform
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                {liveStreamActive ? 'STREAMING ACTIVE' : 'STANDBY'}
              </span>
            </div>

            {/* Live Chart Preview */}
            <div className="p-3 rounded-2xl bg-[#090C12] border border-slate-800/80 h-36 flex flex-col justify-between overflow-hidden">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Risk Score Timeline</span>
              <div className="w-full h-24">
                <TimelineChart timelineData={stats?.timeline || []} isMini={true} />
              </div>
            </div>

            {/* Quick 3 Flow Metrics */}
            <div className="grid grid-cols-3 gap-2 font-mono text-center">
              <div className="p-2.5 rounded-xl bg-[#090C12] border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Total Flows</span>
                <span className="text-base font-extrabold text-white">{totalSessions}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#090C12] border border-rose-500/30">
                <span className="text-[10px] text-rose-400 block uppercase">Anomalies</span>
                <span className="text-base font-extrabold text-rose-400">{anomaliesCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#090C12] border border-slate-800">
                <span className="text-[10px] text-amber-400 block uppercase">Anomaly Rate</span>
                <span className="text-base font-extrabold text-amber-400">{anomalyRate}%</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#090C12] border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>ML Microservice:</span>
              <span className="text-slate-200 font-semibold">FastAPI / iForest (Sub-5ms)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
