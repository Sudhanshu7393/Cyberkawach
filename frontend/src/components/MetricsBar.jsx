import React from 'react';
import { motion } from 'framer-motion';

export default function MetricsBar({ stats }) {
  return (
    <section className="py-14 sm:py-18 text-center relative">
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl mx-auto px-4 sm:px-6 mb-10"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
          Production Telemetry & Core Metrics
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto font-sans leading-relaxed">
          Our distributed pipeline continuously ingests, extracts feature vectors, and evaluates multi-dimensional network sessions across edge proxies, authentication servers, and internal subnets.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 max-w-5xl mx-auto px-4 sm:px-6 font-mono"
      >
        <div className="p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] bg-[#151D2A] border border-slate-800/80 flex flex-col items-center justify-center shadow-lg apple-glass-card">
          <span className="text-2xl sm:text-4xl font-extrabold text-white mb-1">
            3-Tier
          </span>
          <span className="text-xs text-slate-400 font-sans text-center">
            Microservices Engine
          </span>
        </div>

        <div className="p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] bg-gradient-to-br from-amber-500 to-orange-500 text-slate-950 font-bold flex flex-col items-center justify-center shadow-xl shadow-amber-500/20 scale-105 transition hover:scale-110">
          <span className="text-2xl sm:text-4xl font-black text-slate-950 mb-1">
            10,000+
          </span>
          <span className="text-xs text-slate-950/85 font-extrabold font-sans text-center">
            Baseline Profiles
          </span>
        </div>

        <div className="p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] bg-[#151D2A] border border-slate-800/80 flex flex-col items-center justify-center shadow-lg apple-glass-card">
          <span className="text-2xl sm:text-4xl font-extrabold text-white mb-1">
            150+
          </span>
          <span className="text-xs text-slate-400 font-sans text-center">
            Isolation Trees
          </span>
        </div>

        <div className="p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] bg-[#151D2A] border border-slate-800/80 flex flex-col items-center justify-center shadow-lg apple-glass-card">
          <span className="text-2xl sm:text-4xl font-extrabold text-white mb-1">
            &lt; 5ms
          </span>
          <span className="text-xs text-slate-400 font-sans text-center">
            Inference Latency
          </span>
        </div>
      </motion.div>
    </section>
  );
}
