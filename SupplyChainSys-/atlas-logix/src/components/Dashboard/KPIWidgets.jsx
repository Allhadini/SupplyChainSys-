import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle2, AlertTriangle, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { useShipments } from '../../context/ShipmentContext';
import { SkeletonCard } from '../ui';

const kpiConfig = [
  { key: 'total', label: 'Total Shipments', icon: Package, color: 'from-purple-start to-blue-end', shadowColor: 'shadow-purple-start/10' },
  { key: 'inTransit', label: 'In Transit', icon: Truck, color: 'from-blue-end to-cyan-accent', shadowColor: 'shadow-blue-end/10' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2, color: 'from-emerald to-cyan-accent', shadowColor: 'shadow-emerald/10' },
  { key: 'delayed', label: 'Delayed', icon: AlertTriangle, color: 'from-rose to-amber', shadowColor: 'shadow-rose/10', isDanger: true },
];

export default function KPIWidgets() {
  const { kpis, loading } = useShipments();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <SkeletonCard key={i} lines={3} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiConfig.map((cfg, idx) => {
        const Icon = cfg.icon;
        const value = kpis[cfg.key];
        const isUp = cfg.key === 'delivered';
        const isDown = cfg.key === 'delayed';

        return (
          <motion.div
            key={cfg.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.5 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className={`glass glass-hover p-5 relative overflow-hidden group ${cfg.isDanger && value > 0 ? 'border-rose/20' : ''}`}
          >
            {/* Glow effect */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${cfg.color} opacity-[0.06] blur-2xl group-hover:opacity-[0.12] transition-opacity duration-500`} />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">{cfg.label}</span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center ${cfg.shadowColor} shadow-lg`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>

              <motion.div
                key={value}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`text-3xl font-bold ${cfg.isDanger && value > 0 ? 'gradient-text-warm' : 'text-text-primary'}`}
              >
                {value}
              </motion.div>

              <div className="flex items-center gap-1.5 mt-2">
                {isUp && <TrendingUp className="w-3 h-3 text-emerald" />}
                {isDown && value > 0 && <TrendingDown className="w-3 h-3 text-rose" />}
                {!isUp && !isDown && <Clock className="w-3 h-3 text-text-muted" />}
                <span className={`text-[11px] font-medium ${isUp ? 'text-emerald' : isDown && value > 0 ? 'text-rose' : 'text-text-muted'}`}>
                  {isUp ? '+3 today' : isDown && value > 0 ? `${value} need attention` : 'Real-time'}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
