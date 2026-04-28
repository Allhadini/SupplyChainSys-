import { motion } from 'framer-motion';
import { MapPin, Clock, Anchor, Plane, Truck as TruckIcon } from 'lucide-react';
import { Badge, ProgressBar } from '../ui';

const modeIcons = {
  sea: Anchor,
  air: Plane,
  road: TruckIcon,
};

export default function ShipmentCard({ shipment, index = 0, onClick }) {
  const ModeIcon = modeIcons[shipment.mode] || Anchor;

  const formatETA = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diffHrs = Math.max(0, Math.round((d - now) / 3600000));
    if (diffHrs < 1) return 'Arriving';
    if (diffHrs < 24) return `${diffHrs}h`;
    return `${Math.round(diffHrs / 24)}d ${diffHrs % 24}h`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -2, scale: 1.005 }}
      onClick={onClick}
      className={`glass glass-hover p-4 cursor-pointer relative overflow-hidden group ${
        shipment.status === 'Delayed' ? 'border-rose/15' : ''
      }`}
    >
      {/* Status accent line */}
      <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${
        shipment.status === 'Delayed' ? 'from-rose to-amber' :
        shipment.status === 'Delivered' ? 'from-emerald to-cyan-accent' :
        'from-purple-start to-blue-end'
      } opacity-60`} />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            shipment.status === 'Delayed' ? 'bg-rose/10' : 'bg-purple-start/10'
          }`}>
            <ModeIcon className={`w-4 h-4 ${shipment.status === 'Delayed' ? 'text-rose' : 'text-purple-start'}`} />
          </div>
          <div>
            <div className="text-sm font-bold font-mono text-text-primary">{shipment.id}</div>
            <div className="text-[11px] text-text-muted">{shipment.carrier}</div>
          </div>
        </div>
        <Badge variant={shipment.status} pulse={shipment.status === 'In Transit'}>
          {shipment.status}
        </Badge>
      </div>

      {/* Route */}
      <div className="flex items-center gap-2 mb-3 text-xs">
        <div className="flex items-center gap-1 text-text-secondary">
          <MapPin className="w-3 h-3 text-purple-start" />
          <span className="truncate max-w-[100px]">{shipment.origin}</span>
        </div>
        <div className="flex-1 border-t border-dashed border-white/10 relative mx-1">
          <div className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-start to-blue-end ${
            shipment.status === 'In Transit' ? 'animate-pulse-dot' : ''
          }`} style={{ left: `${shipment.progress}%` }} />
        </div>
        <div className="flex items-center gap-1 text-text-secondary">
          <MapPin className="w-3 h-3 text-blue-end" />
          <span className="truncate max-w-[100px]">{shipment.destination}</span>
        </div>
      </div>

      {/* Progress */}
      <ProgressBar
        value={shipment.progress}
        size="sm"
        color={shipment.status === 'Delayed' ? 'rose' : 'purple'}
        showLabel={false}
      />

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1 text-[11px] text-text-muted">
          <Clock className="w-3 h-3" />
          <span>ETA: <strong className="text-text-secondary">{formatETA(shipment.eta)}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={shipment.mode}>{shipment.mode}</Badge>
          {shipment.predictedDelay > 0 && (
            <span className="text-[10px] text-rose font-semibold">+{shipment.predictedDelay}h delay</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
