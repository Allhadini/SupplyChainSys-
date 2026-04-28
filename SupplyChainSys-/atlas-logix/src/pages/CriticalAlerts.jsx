import { motion } from 'framer-motion';
import { useShipments } from '../context/ShipmentContext';
import { Badge } from '../components/ui';
import { AlertTriangle, AlertOctagon, Clock, MapPin, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function CriticalAlerts() {
  const { shipments } = useShipments();
  const [selectedId, setSelectedId] = useState(null);

  // Shipments at risk
  const atRisk = shipments
    .filter(s => s.status === 'Delayed' || s.riskScore > 0.5)
    .sort((a, b) => b.riskScore - a.riskScore);

  const selected = atRisk.find(s => s.id === selectedId) || atRisk[0];

  return (
    <div className="h-[calc(100vh-7rem)] flex gap-4">
      {/* Alert Queue */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-96 flex flex-col"
      >
        <div className="flex items-end justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold gradient-text-warm">Risk Alerts</h1>
            <p className="text-xs text-text-muted mt-1">Sorted by risk severity</p>
          </div>
          <Badge variant="critical">{atRisk.length} flagged</Badge>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {atRisk.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ x: 3 }}
              onClick={() => setSelectedId(s.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all border relative overflow-hidden ${
                selected?.id === s.id
                  ? 'glass border-rose/20 shadow-[0_0_20px_rgba(239,68,68,0.08)]'
                  : 'glass border-transparent hover:border-white/[0.06]'
              }`}
            >
              {/* Severity accent */}
              <div className={`absolute top-0 left-0 w-1 h-full ${
                s.riskScore > 0.7 ? 'bg-rose' : s.riskScore > 0.5 ? 'bg-amber' : 'bg-blue-400'
              }`} />

              <div className="ml-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-bold text-text-primary">{s.id}</span>
                  <span className={`text-xs font-bold ${s.riskScore > 0.7 ? 'text-rose' : 'text-amber'}`}>
                    {(s.riskScore * 100).toFixed(0)}% risk
                  </span>
                </div>
                <div className="text-xs text-text-muted mb-2">{s.carrier} • {s.mode.toUpperCase()}</div>
                <div className="flex items-center gap-2 text-[11px] text-text-secondary">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{s.origin} → {s.destination}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant={s.status}>{s.status}</Badge>
                  {s.predictedDelay > 0 && (
                    <span className="text-[10px] text-rose font-semibold">+{s.predictedDelay}h delay</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {atRisk.length === 0 && (
            <div className="text-center text-text-muted py-12">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No risk alerts at this time</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Detail Panel */}
      {selected ? (
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 glass overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/[0.06] bg-rose/[0.02]">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose/10 flex items-center justify-center">
                  <AlertOctagon className="w-6 h-6 text-rose" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary">{selected.id}</h2>
                  <div className="text-sm text-text-muted mt-0.5">{selected.carrier} — {selected.cargo}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${selected.riskScore > 0.7 ? 'text-rose' : 'text-amber'}`}>
                  {(selected.riskScore * 100).toFixed(0)}%
                </div>
                <div className="text-[10px] text-text-muted uppercase tracking-wider">Risk Score</div>
              </div>
            </div>

            {/* Alert banner */}
            <div className="glass-subtle p-4 rounded-xl border border-rose/15 bg-rose/[0.03]">
              <div className="text-sm text-text-primary font-medium mb-1">⚠️ Risk Assessment Summary</div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {selected.status === 'Delayed'
                  ? `Shipment ${selected.id} is experiencing delays on route ${selected.origin} → ${selected.destination}. Predicted additional delay: +${selected.predictedDelay || 'N/A'} hours. Carrier: ${selected.carrier}. Current progress: ${Math.round(selected.progress)}%.`
                  : `Shipment ${selected.id} has elevated risk factors (${(selected.riskScore * 100).toFixed(0)}%). Route monitoring active for ${selected.origin} → ${selected.destination}. Mode: ${selected.mode.toUpperCase()}.`
                }
              </p>
            </div>
          </div>

          {/* Details grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-sm font-bold gradient-text mb-4">Shipment Intelligence</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Origin', value: selected.origin, icon: '📍' },
                { label: 'Destination', value: selected.destination, icon: '🎯' },
                { label: 'Mode', value: selected.mode.toUpperCase(), icon: '🚢' },
                { label: 'Cargo', value: selected.cargo, icon: '📦' },
                { label: 'Weight', value: selected.weight, icon: '⚖️' },
                { label: 'Containers', value: selected.containers, icon: '🏗️' },
                { label: 'Region', value: selected.region, icon: '🌍' },
                { label: 'Priority', value: selected.priority, icon: '🔥' },
              ].map(item => (
                <div key={item.label} className="glass-subtle p-3 rounded-xl">
                  <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{item.icon} {item.label}</div>
                  <div className="text-sm font-semibold text-text-primary">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <h3 className="text-sm font-bold gradient-text mb-4">Resolution Timeline</h3>
            <div className="space-y-4 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-rose before:to-transparent">
              {[
                { time: 'Now', event: 'Risk alert triggered — automated monitoring active', active: true },
                { time: '-2h', event: `Speed anomaly detected at coordinates (${selected.currentLat?.toFixed(2)}, ${selected.currentLng?.toFixed(2)})`, active: false },
                { time: '-4h', event: 'Route deviation from optimal path identified', active: false },
                { time: '-6h', event: `Departed ${selected.origin} — normal parameters`, active: false },
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-4 top-1 w-3 h-3 rounded-full border-2 ${
                    step.active ? 'border-rose bg-rose/30 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'border-white/20 bg-obsidian'
                  }`} />
                  <div className="text-[10px] text-text-muted mb-0.5">{step.time}</div>
                  <div className={`text-xs ${step.active ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>{step.event}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 glass flex items-center justify-center text-text-muted">
          Select an alert to view details
        </div>
      )}
    </div>
  );
}
