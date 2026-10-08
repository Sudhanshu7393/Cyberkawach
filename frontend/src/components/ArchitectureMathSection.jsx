import React, { useState } from 'react';
import { Layers, Cpu, Server, Network, BookOpen, Binary, Sliders, CheckCircle2, Copy, Check } from 'lucide-react';
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
    <section className="py-14 sm:py-20 text-left relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400 font-bold mb-3">
            <Binary className="w-3.5 h-3.5" />
            <span>Underlying Mathematics & Engineering Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            How CyberKawach Operates Internally
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 font-sans leading-relaxed">
            Unlike heuristic static firewalls, CyberKawach uses recursive random partitioning to isolate anomalous data points closer to the tree roots.
          </p>

          {/* Sub-Tabs */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'architecture'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-[#151D2A] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>3-Tier Architecture Flow</span>
            </button>
            <button
              onClick={() => setActiveTab('math')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'math'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-[#151D2A] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Isolation Forest Math Formula</span>
            </button>
          </div>
        </motion.div>

        {activeTab === 'architecture' ? (
          /* Architecture Diagram Grid */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono"
          >
            {/* Tier 1: React UI */}
            <div className="p-6 rounded-2xl bg-[#151D2A] border border-slate-800/80 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition">
              <div className="absolute top-0 right-0 px-3 py-1 bg-slate-800 text-[10px] text-slate-400 rounded-bl-xl border-l border-b border-slate-700">
                PORT 5173
              </div>
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white font-sans">Frontend Presentation Tier</h3>
                <span className="text-xs text-blue-400 block mt-0.5">React 19 &bull; Vite &bull; Tailwind &bull; Recharts</span>
                <p className="text-xs text-slate-400 font-sans mt-3 leading-relaxed">
                  Renders the live SOC telemetry feed, real-time threat gauges, Apple smooth kinetic scrolling, and interactive attack simulation triggers.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>State Sync:</span>
                  <span className="text-slate-200">React Hooks & Polling</span>
                </div>
                <div className="flex justify-between">
                  <span>Visual Engine:</span>
                  <span className="text-slate-200">SVG Sparkline & Canvas</span>
                </div>
              </div>
            </div>

            {/* Tier 2: Express Backend */}
            <div className="p-6 rounded-2xl bg-[#151D2A] border border-slate-800/80 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition">
              <div className="absolute top-0 right-0 px-3 py-1 bg-slate-800 text-[10px] text-slate-400 rounded-bl-xl border-l border-b border-slate-700">
                PORT 5000
              </div>
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                  <Server className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white font-sans">API Gateway & Persistence</h3>
                <span className="text-xs text-emerald-400 block mt-0.5">Node.js &bull; Express &bull; Dual-Persistence</span>
                <p className="text-xs text-slate-400 font-sans mt-3 leading-relaxed">
                  Handles REST ingestion, payload validation, automated failover between Supabase Cloud Postgres and zero-config local disk ledger.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Database:</span>
                  <span className="text-slate-200">Supabase / Local JSON</span>
                </div>
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="text-emerald-400 font-bold">&lt; 1.5 ms</span>
                </div>
              </div>
            </div>

            {/* Tier 3: Python FastAPI ML */}
            <div className="p-6 rounded-2xl bg-[#151D2A] border border-amber-500/30 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/50 transition">
              <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500/20 text-[10px] text-amber-400 rounded-bl-xl border-l border-b border-amber-500/30 font-bold">
                PORT 8000
              </div>
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white font-sans">Python ML Inference Engine</h3>
                <span className="text-xs text-amber-400 block mt-0.5">FastAPI &bull; NumPy &bull; Isolation Forest</span>
                <p className="text-xs text-slate-400 font-sans mt-3 leading-relaxed">
                  Executes pure vectorized Isolation Forest tree depth calculations on 7 behavioral dimensions with sub-5ms mathematical latency.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
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
          /* Mathematical Formula Display */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="p-6 sm:p-8 rounded-3xl bg-[#151D2A] border border-slate-800/80 shadow-2xl font-mono"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                    Mathematical Anomaly Score Formulation
                  </span>
                  <button
                    onClick={copyFormula}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 p-1.5 rounded bg-slate-800 border border-slate-700 cursor-pointer"
                  >
                    {copiedFormula ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFormula ? 'Copied' : 'Copy Formula'}</span>
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-[#0D1117] border border-slate-800 text-center">
                  <div className="text-xl sm:text-3xl font-extrabold text-white tracking-wide my-2">
                    s(x, n) = 2<sup>&minus; rac{'{'}E(h(x)){'}'}{'{'}c(n){'}'}</sup>
                  </div>
                  <div className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800">
                    c(n) = 2 ln(n &minus; 1) + 0.5772156649 &minus; rac{'{'}2(n &minus; 1){'}'}{'{'}n{'}'}
                  </div>
                </div>

                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  <strong className="text-white">Interpretation:</strong> When <span className="text-rose-400 font-bold">s &rarr; 1.0</span>, the average path length <span className="font-mono text-slate-200">E(h(x))</span> is very short, isolating the observation rapidly &mdash; confirming a <strong>definite anomaly</strong>. When <span className="text-emerald-400 font-bold">s &lt; 0.5</span>, data points require deep partitioning and belong to standard cluster baselines.
                </p>
              </div>

              <div className="lg:col-span-6 space-y-3 font-sans">
                <div className="p-4 rounded-xl bg-[#0D1117] border border-slate-800 text-xs space-y-1.5">
                  <span className="text-amber-400 font-mono font-bold block text-[11px] uppercase">
                    Key Behavioral Feature Dimensions:
                  </span>
                  <ul className="space-y-1 text-slate-300 font-mono text-[11px]">
                    <li>&bull; <strong className="text-slate-200">login_hour:</strong> Time of access (0-23 hrs)</li>
                    <li>&bull; <strong className="text-slate-200">country_change_flag:</strong> Impossible velocity jump (0/1)</li>
                    <li>&bull; <strong className="text-slate-200">download_mb & upload_mb:</strong> Continuous volumetric telemetry</li>
                    <li>&bull; <strong className="text-slate-200">failed_login_count:</strong> Credential spray frequency</li>
                    <li>&bull; <strong className="text-slate-200">requests_per_minute:</strong> Ingress HTTP/TCP frequency</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#0D1117] border border-slate-800 text-xs flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-slate-200 font-bold block">Academic Citation:</span>
                    <span className="text-slate-400 text-[11px]">
                      Liu, F. T., Ting, K. M., & Zhou, Z. H. (2008). <em>Isolation Forest</em>. IEEE International Conference on Data Mining (ICDM), pp. 413-422.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
