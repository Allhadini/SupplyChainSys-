import { motion } from 'framer-motion';
import KPIWidgets from '../components/Dashboard/KPIWidgets';
import GlobalMap from '../components/Dashboard/GlobalMap';
import LiveFeed from '../components/Dashboard/LiveFeed';
import ShipmentCard from '../components/Dashboard/ShipmentCard';
import FiltersPanel from '../components/Dashboard/FiltersPanel';
import AnalyticsPanel from '../components/Dashboard/AnalyticsPanel';
import { useShipments } from '../context/ShipmentContext';
import { SkeletonCard } from '../components/ui';

export default function Dashboard() {
  const { filteredShipments, loading } = useShipments();

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">
            <span className="gradient-text">Command Center</span>
          </h1>
          <p className="text-sm text-text-muted mt-1">Real-time overview of your global logistics network</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald animate-pulse-dot" />
          <span className="text-xs text-text-muted">Live • Updated {new Date().toLocaleTimeString()}</span>
        </div>
      </motion.div>

      {/* KPIs */}
      <KPIWidgets />

      {/* Filters */}
      <FiltersPanel />

      {/* Map + Live Feed row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass overflow-hidden"
            style={{ height: '420px' }}
          >
            <GlobalMap height="100%" minimal={false} />
          </motion.div>
        </div>
        <div className="lg:col-span-1" style={{ height: '420px' }}>
          <LiveFeed />
        </div>
      </div>

      {/* Shipment Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold gradient-text">Active Shipments</h2>
          <span className="text-xs text-text-muted">{filteredShipments.length} shipments</span>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} lines={4} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredShipments.map((s, i) => (
              <ShipmentCard key={s.id} shipment={s} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Analytics */}
      <div>
        <h2 className="text-lg font-bold gradient-text mb-4">Analytics Overview</h2>
        <AnalyticsPanel />
      </div>
    </div>
  );
}
