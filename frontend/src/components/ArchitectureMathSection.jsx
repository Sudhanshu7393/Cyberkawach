import React, { useState } from 'react';
import { Layers, Cpu, Server, Network, BookOpen, Binary, Sliders, CheckCircle2, Copy, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ArchitectureMathSection() {
  const [activeTab, setActiveTab] = useState('architecture');
  const [copiedFormula, setCopiedFormula] = useState(false);

  const copyFormula = () => {
    navigator.clipboard.writeText("s(x, n) = 2^(-E(h(x)) / c(n))");
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2000);
  };

  return (
    <section className="py-12 sm:py-16 text-left relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-10 space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs font-mono text-amber-400 font-semibold">
            <Binary className="w-3.5 h-3.5" />
            <span>Mathematical Foundations & Engineering Specs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
            How CyberKawach Operates Internally
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            Rather than relying on static blacklists, CyberKawach isolates anomalous flows via recursive partitioning and analyzes lexical token distributions.
          </p>

          {/* Sub-Tabs Switcher */}
          <div className="flex items-center justify-center gap-2 pt-3">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`btn-tactile px-4 py-2 rounded-xl text-xs font-semibold font-mono transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'architecture'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/[0.08]'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>3-Tier Architecture Flow</span>
            </button>
            <button
              onClick={() => setActiveTab('math')}
              className={`btn-tactile px-4 py-2 rounded-xl text-xs font-semibold font-mono transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'math'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/[0.08]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Dual ML Formulations</span>
            </button>
          </div>
        </motion.div>

        {activeTab === 'architecture' ? (
          /* Architecture Diagram Grid */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono"
          >
            {/* Tier 1: React UI */}
            <div className="p-6 rounded-3xl glass-card-interactive flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 px-3 py-1 bg-slate-800/80 text-[10px] text-slate-400 rounded-bl-xl border-l border-b border-white/[0.06] font-mono">
                PORT 5173
              </div>
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white font-sans">Frontend Presentation Tier</h3>
                <span className="text-xs text-blue-400 block mt-0.5">React 19 &bull; Vite &bull; Tailwind &bull; Recharts</span>
                <p className="text-xs text-slate-400 font-sans mt-3 leading-relaxed">
                  Renders the live SOC telemetry feed, real-time threat gauges, tactile attack simulation triggers, and an autonomous client engine on Vercel.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/[0.06] text-[11px] text-slate-400 space-y-1.5">
                <div className="flex justify-between">
                  <span>State Engine:</span>
                  <span className="text-slate-200">React State & Engine Fallback</span>
                </div>
                <div className="flex justify-between">
                  <span>Visual Engine:</span>
                  <span className="text-slate-200">SVG Sparkline & Motion</span>
                </div>
              </div>
            </div>

            {/* Tier 2: Express Backend */}
            <div className="p-6 rounded-3xl glass-card-interactive flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 px-3 py-1 bg-slate-800/80 text-[10px] text-slate-400 rounded-bl-xl border-l border-b border-white/[0.06] font-mono">
                PORT 5000
              </div>
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-4">
                  <Server className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white font-sans">API Gateway & Persistence</h3>
                <span className="text-xs text-emerald-400 block mt-0.5">Node.js &bull; Express &bull; Dual-Ledger</span>
                <p className="text-xs text-slate-400 font-sans mt-3 leading-relaxed">
                  Handles REST ingestion, payload validation, automated alert dispatch notifications, and local disk ledger persistence.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/[0.06] text-[11px] text-slate-400 space-y-1.5">
                <div className="flex justify-between">
                  <span>Database:</span>
                  <span className="text-slate-200">Supabase Cloud / Local JSON</span>
                </div>
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="text-emerald-400 font-bold">&lt; 1.5 ms</span>
                </div>
              </div>
            </div>

            {/* Tier 3: Python ML Service */}
            <div className="p-6 rounded-3xl glass-card-interactive border-amber-500/30 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500/20 text-[10px] text-amber-400 rounded-bl-xl border-l border-b border-amber-500/30 font-mono font-bold">
                PORT 8000
              </div>
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-4">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white font-sans">Python ML Inference Engine</h3>
                <span className="text-xs text-amber-400 block mt-0.5">FastAPI &bull; Scikit-Learn &bull; iForest</span>
                <p className="text-xs text-slate-400 font-sans mt-3 leading-relaxed">
                  Executes pure vectorized Isolation Forest tree depth calculations on 7 behavioral dimensions with sub-5ms mathematical latency.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/[0.06] text-[11px] text-slate-400 space-y-1.5">
                <div className="flex justify-between">
                  <span>Ensemble:</span>
                  <span className="text-slate-200">150 Isolation Trees</span>
                </div>
                <div className="flex justify-between">
                  <span>Inference:</span>
                  <span className="text-amber-400 font-bold">&lt; 3.2 ms</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Mathematical Formulations Display */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="p-6 sm:p-8 rounded-3xl glass-panel space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
              {/* Formula 1: Isolation Forest */}
              <div className="p-6 rounded-2xl bg-[#080C14]/90 border border-white/[0.06] space-y-4 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                    Layer 1: Isolation Forest Formula
                  </span>
                  <button
                    onClick={copyFormula}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800 border border-white/[0.08] cursor-pointer"
                  >
                    {copiedFormula ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFormula ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-white/[0.06] text-center space-y-2">
                  <div className="text-lg sm:text-2xl font-black text-white tracking-wide">
                    s(x, n) = 2<sup>- E(h(x)) / c(n)</sup>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-2 border-t border-white/[0.06]">
                    c(n) = 2 ln(n - 1) + 0.5772156649 - [2(n - 1) / n]
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  <strong className="text-white">Explanation:</strong> When score <span className="text-rose-400 font-bold">s &rarr; 1.0</span>, the path length <span className="text-amber-300 font-mono">E(h(x))</span> is very short—meaning the data point was isolated rapidly near the root (a true anomaly). When <span className="text-emerald-400 font-bold">s &lt; 0.5</span>, data points require deep splits and belong to normal baseline clusters.
                </p>
              </div>

              {/* Formula 2: Shannon Entropy */}
              <div className="p-6 rounded-2xl bg-[#080C14]/90 border border-white/[0.06] space-y-4 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                    Layer 2: Shannon Information Entropy
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">Information Theory</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-white/[0.06] text-center space-y-2">
                  <div className="text-lg sm:text-2xl font-black text-white tracking-wide">
                    H(X) = - &sum; p(x<sub>i</sub>) &middot; log<sub>2</sub> p(x<sub>i</sub>)
                  </div>
                  <div className="text-[11px] text-slate-400 pt-2 border-t border-white/[0.06]">
                    Calculated over all character frequencies in target URL
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  <strong className="text-white">Explanation:</strong> Phishing lures and algorithmic malware domains (DGA) display unusually high randomness (<span className="text-rose-400 font-bold">H(X) &gt; 4.2</span>) or deceptive lexical separators like <span className="text-amber-300 font-mono">'@'</span> and hyphens to mislead unsuspecting victims.
                </p>
              </div>

            </div>

            {/* Academic Reference */}
            <div className="p-4 rounded-2xl bg-[#080C14]/60 border border-white/[0.06] text-xs flex items-center gap-3 font-sans">
              <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-slate-200 font-bold block">Academic Citations:</span>
                <span className="text-slate-400 text-[11px]">
                  Liu, F. T., et al. (2008). <em>Isolation Forest</em>. IEEE ICDM. &bull; Shannon, C. E. (1948). <em>A Mathematical Theory of Communication</em>. Bell System Technical Journal.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
