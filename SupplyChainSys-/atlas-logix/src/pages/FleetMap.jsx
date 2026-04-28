import { motion } from 'framer-motion';
import GlobalMap from '../components/Dashboard/GlobalMap';
import FiltersPanel from '../components/Dashboard/FiltersPanel';
import { useShipments } from '../context/ShipmentContext';
import { Badge, ProgressBar } from '../components/ui';
import { useState } from 'react';
import { MapPin, Anchor, Plane, Truck, Clock, ChevronRight } from 'lucide-react';

const modeIcons = { sea: Anchor, air: Plane, road: Truck };

export default function FleetMap() {
  const { filteredShipments, kpis } = useShipments();
  const [selectedId, setSelectedId] = useState(null);
  const selected = filteredShipments.find(s => s.id === selectedId);

  const formatETA = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diffHrs = Math.max(0, Math.round((d - now) / 3600000));
    if (diffHrs < 1) return 'Arriving';
    if (diffHrs < 24) return `${diffHrs}h`;
    return `${Math.round(diffHrs / 24)}d ${diffHrs % 24}h`;
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col gap-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Global Tracking Map</h1>
            <p className="text-sm text-text-muted mt-1">Interactive real-time shipment visualization</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="in transit" pulse>{kpis.inTransit} in transit</Badge>
            {kpis.delayed > 0 && <Badge variant="delayed" pulse>{kpis.delayed} delayed</Badge>}
          </div>
        </div>
        <FiltersPanel />
      </motion.div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Map */}
        <div className="flex-1 glass overflow-hidden rounded-xl">
          <GlobalMap height="100%" />
        </div>

        {/* Shipment sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 flex flex-col glass overflow-hidden"
        >
          <div className="p-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-bold gradient-text">Fleet Roster</h3>
            <p className="text-[11px] text-text-muted mt-0.5">{filteredShipments.length} active shipments</p>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredShipments.map(s => {
              const ModeIcon = modeIcons[s.mode] || Anchor;
              const isSelected = selectedId === s.id;
              return (
                <motion.div
                  key={s.id}
                  whileHover={{ x: 2 }}
                  onClick={() => setSelectedId(isSelected ? null : s.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-purple-start/10 border-purple-start/20'
                      : 'border-transparent hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <ModeIcon className={`w-3.5 h-3.5 ${
                        s.status === 'Delayed' ? 'text-rose' : 'text-purple-start'
                      }`} />
                      <span className="text-xs font-mono font-bold text-text-primary">{s.id}</span>
                    </div>
                    <Badge variant={s.status}>{s.status}</Badge>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-text-muted mb-2">
                    <MapPin className="w-2.5 h-2.5" />
                    <span className="truncate">{s.origin}</span>
                    <ChevronRight className="w-2.5 h-2.5" />
                    <span className="truncate">{s.destination}</span>
                  </div>

                  <ProgressBar
                    value={s.progress}
                    size="sm"
                    color={s.status === 'Delayed' ? 'rose' : 'purple'}
                    showLabel={false}
                  />

                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-white/[0.06] space-y-2 text-[11px]"
                    >
                      <div className="flex justify-between text-text-secondary">
                        <span>Carrier</span>
                        <span className="text-text-primary font-medium">{s.carrier}</span>
                      </div>
                      <div className="flex justify-between text-text-secondary">
                        <span>Cargo</span>
                        <span className="text-text-primary font-medium">{s.cargo}</span>
                      </div>
                      <div className="flex justify-between text-text-secondary">
                        <span>ETA</span>
                        <span className="text-text-primary font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />{formatETA(s.eta)}
                        </span>
                      </div>
                      <div className="flex justify-between text-text-secondary">
                        <span>Weight</span>
                        <span className="text-text-primary font-medium">{s.weight}</span>
                      </div>
                      <div className="flex justify-between text-text-secondary">
                        <span>Containers</span>
                        <span className="text-text-primary font-medium">{s.containers}</span>
                      </div>
                      {s.predictedDelay > 0 && (
                        <div className="flex justify-between">
                          <span className="text-rose">Predicted Delay</span>
                          <span className="text-rose font-bold">+{s.predictedDelay}h</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
