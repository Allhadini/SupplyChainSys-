import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Zap, ArrowRight, Globe2, BarChart3, Shield,
  Radio, MapPin, Layers, Package, ChevronRight
} from 'lucide-react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] },
});

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-void text-text-primary" style={{ minWidth: 1200 }}>

      {/* ── Ambient background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_-5%,rgba(124,58,237,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_85%_65%,rgba(59,130,246,0.07),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_30%_at_15%_80%,rgba(6,182,212,0.04),transparent_50%)]" />
      </div>

      {/* ══════════════════════ NAV ══════════════════════ */}
      <motion.nav {...fade(0)} className="relative z-50 w-full px-10 pt-6">
        <div className="max-w-[1760px] mx-auto flex items-center justify-between glass rounded-2xl px-8 py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-base font-bold gradient-text tracking-tight">SupplyChainSys</span>
          </div>
          <div className="flex items-center gap-10 text-sm text-text-muted">
            <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
            <a href="#how" className="hover:text-text-primary transition-colors">How It Works</a>
            <a href="#cta" className="hover:text-text-primary transition-colors">Get Started</a>
          </div>
          <button onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-shadow">
            Open Dashboard
          </button>
        </div>
      </motion.nav>

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="relative z-10 w-full px-10 pt-28 pb-10">
        <div className="max-w-[1760px] mx-auto flex items-center gap-20">

          {/* Left — Copy */}
          <div className="w-[46%] flex-shrink-0">
            <motion.div {...fade(0.1)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-subtle text-xs font-medium text-purple-400 mb-8 tracking-wide">
              <Radio className="w-3.5 h-3.5" /> Live tracking across 180+ countries
            </motion.div>

            <motion.h1 {...fade(0.2)} className="text-6xl xl:text-7xl font-black leading-[1.02] tracking-tight mb-6">
              Global Logistics<br />
              <span className="gradient-text">Command Center</span>
            </motion.h1>

            <motion.p {...fade(0.3)} className="text-lg text-text-secondary max-w-lg leading-relaxed mb-10">
              Real-time shipment tracking, predictive analytics, and risk intelligence — unified in one premium enterprise dashboard.
            </motion.p>

            <motion.div {...fade(0.4)} className="flex gap-4">
              <button onClick={() => navigate('/dashboard')}
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold text-[15px] shadow-xl shadow-purple-500/20 hover:shadow-purple-500/35 transition-shadow flex items-center gap-2.5">
                Enter Command Center
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#features"
                className="px-8 py-4 rounded-2xl glass text-text-secondary font-semibold text-[15px] hover:text-text-primary transition-all flex items-center gap-2">
                Learn More <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Stat chips */}
            <motion.div {...fade(0.55)} className="flex gap-6 mt-14">
              {[
                { val: '2.4M+', label: 'Shipments' },
                { val: '99.7%', label: 'Uptime' },
                { val: '180+', label: 'Countries' },
                { val: '<200ms', label: 'Latency' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl font-bold gradient-text">{s.val}</div>
                  <div className="text-[11px] text-text-muted mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Dashboard preview */}
          <motion.div {...fade(0.5)} className="flex-1 relative">
            <div className="absolute -inset-8 bg-gradient-to-br from-purple-500/12 via-blue-500/6 to-transparent rounded-3xl blur-3xl" />
            <div className="relative glass rounded-2xl p-1.5 border border-white/[0.06]">
              <div className="bg-obsidian rounded-xl overflow-hidden">
                {/* Title bar */}
                <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.04]">
                  <div className="w-3 h-3 rounded-full bg-rose/60" />
                  <div className="w-3 h-3 rounded-full bg-amber/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald/60" />
                  <span className="text-[11px] text-text-muted ml-3 font-mono">SupplyChainSys — Command Center</span>
                </div>

                <div className="p-5">
                  {/* KPI row */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                      { label: 'Total Shipments', val: '15', col: 'gradient-text' },
                      { label: 'In Transit', val: '9', col: 'text-blue-400' },
                      { label: 'Delivered', val: '4', col: 'text-emerald' },
                      { label: 'Delayed', val: '2', col: 'text-rose', danger: true },
                    ].map((k, i) => (
                      <div key={i} className={`glass-subtle rounded-xl p-4 ${k.danger ? 'border border-rose/15' : ''}`}>
                        <div className={`text-2xl font-bold ${k.col}`}>{k.val}</div>
                        <div className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">{k.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Map + Feed */}
                  <div className="grid grid-cols-5 gap-3">
                    {/* Map area */}
                    <div className="col-span-3 glass-subtle rounded-xl h-56 relative overflow-hidden p-4">
                      <div className="text-[11px] text-text-muted mb-1 font-medium">🌍 Global Tracking Map</div>
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 224" fill="none">
                        <path d="M80,80 Q200,30 300,70" stroke="#7c3aed" strokeWidth="1.5" opacity="0.25" strokeDasharray="6,6" />
                        <path d="M250,65 Q380,100 480,75" stroke="#3b82f6" strokeWidth="1.5" opacity="0.25" />
                        <path d="M120,130 Q280,85 380,110" stroke="#10b981" strokeWidth="1.5" opacity="0.2" />
                        <path d="M350,50 Q420,120 520,95" stroke="#06b6d4" strokeWidth="1" opacity="0.15" strokeDasharray="4,4" />
                      </svg>
                      {[
                        { x: '14%', y: '38%', c: '#7c3aed' },
                        { x: '48%', y: '30%', c: '#3b82f6' },
                        { x: '78%', y: '35%', c: '#10b981' },
                        { x: '25%', y: '58%', c: '#ef4444' },
                        { x: '60%', y: '48%', c: '#f59e0b' },
                        { x: '85%', y: '42%', c: '#06b6d4' },
                      ].map((d, i) => (
                        <motion.div key={i} className="absolute w-2.5 h-2.5 rounded-full"
                          style={{ left: d.x, top: d.y, background: d.c, boxShadow: `0 0 12px ${d.c}50` }}
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2.5, delay: i * 0.35, repeat: Infinity }}
                        />
                      ))}
                    </div>

                    {/* Feed area */}
                    <div className="col-span-2 glass-subtle rounded-xl p-4 h-56 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-[11px] text-text-muted font-medium">📡 Live Activity Feed</div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                          <span className="text-[9px] text-text-muted">Live</span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2 overflow-hidden">
                        {[
                          { icon: '📦', text: 'SCX-482 cleared customs at Rotterdam' },
                          { icon: '🚢', text: 'GLB-193 departed Shanghai via Maersk' },
                          { icon: '⚠️', text: 'FRT-771 weather delay — Bay of Bengal' },
                          { icon: '✅', text: 'SCS-022 delivered at Long Beach' },
                          { icon: '🔄', text: 'FRT-118 rerouted — ETA updated' },
                          { icon: '📡', text: 'GLB-455 GPS ping — 67% complete' },
                        ].map((e, i) => (
                          <motion.div key={i}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + i * 0.12 }}
                            className="text-[10px] text-text-secondary py-1.5 px-2.5 rounded-lg bg-white/[0.02] border-l-2 border-purple-500/20 truncate">
                            {e.icon} {e.text}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════ FEATURES ══════════════════════ */}
      <section id="features" className="relative z-10 w-full px-10 py-28">
        <div className="max-w-[1760px] mx-auto">
          <motion.div {...fade(0)} className="text-center mb-16">
            <h2 className="text-4xl xl:text-5xl font-black mb-4">
              <span className="gradient-text">Core Capabilities</span>
            </h2>
            <p className="text-base text-text-secondary max-w-lg mx-auto">
              Everything you need to command global logistics operations from a single pane of glass.
            </p>
          </motion.div>

          {/* Primary features — 3 cards */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {[
              { icon: Globe2, title: 'Global Real-Time Map', desc: 'Track every shipment on an interactive dark-themed world map with animated curved routes, glowing GPS markers, and click-to-select details.', gradient: 'from-purple-500 to-blue-500' },
              { icon: BarChart3, title: 'Predictive Analytics', desc: 'AI-powered ETA predictions, regional performance bar charts, 24-hour trend analysis, transport mode distribution, and risk scoring dashboards.', gradient: 'from-blue-500 to-cyan-500' },
              { icon: Shield, title: 'Risk Intelligence', desc: 'Automated severity alerts with real-time risk scores, resolution timelines, proactive delay prediction, and intelligent threat assessment.', gradient: 'from-rose-500 to-amber-500' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="glass glass-hover p-8 group relative overflow-hidden"
                >
                  <div className={`absolute -top-14 -right-14 w-40 h-40 rounded-full bg-gradient-to-br ${f.gradient} opacity-[0.04] blur-3xl group-hover:opacity-[0.1] transition-opacity duration-700`} />
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-text-primary mb-2.5">{f.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Secondary features — 3 compact cards */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: Radio, title: 'Live Activity Feed', desc: 'Real-time scrolling event stream with customs clearance, GPS pings, weather delays, and reroute notifications.' },
              { icon: Layers, title: 'Multi-Modal Tracking', desc: 'Sea, air, and road shipment tracking with differentiated curved route paths and mode-specific analytics.' },
              { icon: MapPin, title: 'Timezone Intelligence', desc: 'Global timezone clocks across 6 major logistics hubs for seamless cross-continent coordination.' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-subtle rounded-xl p-6 flex items-start gap-4 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary mb-1.5">{f.title}</h3>
                    <p className="text-xs text-text-muted leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════ HOW IT WORKS ══════════════════════ */}
      <section id="how" className="relative z-10 w-full px-10 py-28">
        <div className="max-w-[1400px] mx-auto">
          <motion.div {...fade(0)} className="text-center mb-16">
            <h2 className="text-4xl xl:text-5xl font-black mb-4">
              <span className="gradient-text">How It Works</span>
            </h2>
            <p className="text-base text-text-secondary max-w-md mx-auto">Three steps from raw data to actionable logistics intelligence.</p>
          </motion.div>

          <div className="grid grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Connect', desc: 'Integrate carrier APIs, IoT sensors, and AIS feeds. Data flows into the system automatically from all your logistics partners.', icon: Globe2 },
              { step: '02', title: 'Monitor', desc: 'Watch shipments move in real-time on the global map. Get instant alerts on delays, customs holds, and weather disruptions.', icon: Radio },
              { step: '03', title: 'Optimize', desc: 'Use predictive analytics to reduce freight costs, improve ETA accuracy, and proactively mitigate supply chain risks.', icon: BarChart3 },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="glass p-8 text-center relative overflow-hidden"
                >
                  <div className="text-7xl font-black text-white/[0.02] absolute top-2 right-6 select-none">{s.step}</div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl glass-subtle mx-auto mb-5 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════ CTA ══════════════════════ */}
      <section id="cta" className="relative z-10 w-full px-10 py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-[1200px] mx-auto relative"
        >
          <div className="absolute -inset-8 bg-gradient-to-r from-purple-500/8 via-blue-500/4 to-transparent rounded-3xl blur-3xl" />
          <div className="relative glass rounded-3xl p-16 text-center border border-purple-500/10">
            <h2 className="text-4xl xl:text-5xl font-black mb-4">
              Ready to <span className="gradient-text">take command</span>?
            </h2>
            <p className="text-base text-text-secondary max-w-lg mx-auto mb-10">
              Join logistics companies worldwide using SupplyChainSys to track, analyze, and optimize global supply chain operations.
            </p>
            <button onClick={() => navigate('/dashboard')}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-base shadow-xl shadow-purple-500/20 hover:shadow-purple-500/35 transition-shadow inline-flex items-center gap-3">
              Launch Command Center <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer className="relative z-10 border-t border-white/[0.04] py-8 px-10">
        <div className="max-w-[1760px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold gradient-text">SupplyChainSys</span>
          </div>
          <p className="text-xs text-text-muted">© 2026 SupplyChainSys. Enterprise logistics intelligence platform.</p>
          <div className="flex gap-8">
            {['Privacy', 'Terms', 'Status', 'Docs'].map(l => (
              <a key={l} href="#" className="text-xs text-text-muted hover:text-text-secondary transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
