import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ShieldCheck, Cpu, Zap, Activity } from 'lucide-react';

export default function MetricsBar({ stats }) {
  const telemetryCards = [
    {
      value: "3-Tier",
      label: "Modular Architecture",
      desc: "Vite React Frontend, Node API Gateway, & Python ML Microservice",
      icon: Layers,
      highlight: false
    },
    {
      value: "10,000+",
      label: "Normal Baselines",
      desc: "Learned baseline flow patterns to prevent false alarms",
      icon: ShieldCheck,
      highlight: true
    },
    {
      value: "150 Trees",
      label: "Ensemble Forest",
      desc: "Multi-dimensional recursive partitioning for robust outlier isolation",
      icon: Cpu,
      highlight: false
    },
    {
      value: "< 5ms",
      label: "Inference Latency",
      desc: "Instant evaluation before intruders can exfiltrate sensitive data",
      icon: Zap,
      highlight: false
    }
  ];

  return (
    <section className="py-12 sm:py-16 text-center relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mx-auto px-4 sm:px-6 mb-10 space-y-2"
      >
        <span className="text-xs font-mono font-semibold text-amber-400 tracking-wider uppercase px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 inline-block">
          Engine Specifications
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
          Built for High-Throughput & Precision
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
          Engineered for continuous telemetry ingestion with zero downtime and sub-5ms decision boundaries.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto px-4 sm:px-6"
      >
        {telemetryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx}
              className={`p-6 rounded-3xl text-left flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
                card.highlight
                  ? 'bg-gradient-to-br from-amber-500/[0.15] via-slate-900 to-slate-900 border border-amber-500/40 shadow-xl shadow-amber-500/5'
                  : 'glass-card-interactive'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    card.highlight 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                      : 'bg-slate-800/80 text-slate-400 border border-white/[0.08]'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Tier 0{idx + 1}</span>
                </div>

                <div>
                  <span className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight block ${
                    card.highlight ? 'text-amber-400' : 'text-white'
                  }`}>
                    {card.value}
                  </span>
                  <span className="text-xs font-bold text-slate-200 mt-1 block font-sans">
                    {card.label}
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Verification:</span>
                <span className="text-slate-400 font-medium">Validated</span>
              </div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
