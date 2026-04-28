import { motion } from 'framer-motion';
import AnalyticsPanel from '../components/Dashboard/AnalyticsPanel';
import { useShipments } from '../context/ShipmentContext';
import { Download, TrendingUp, DollarSign, Clock, Percent } from 'lucide-react';

export default function Analytics() {
  const { kpis, shipments } = useShipments();

  const financialKPIs = [
    { label: 'Freight Spend', value: '$2.4M', change: '-4.2%', icon: DollarSign, isGood: true },
    { label: 'On-Time Rate', value: `${Math.round((kpis.delivered / Math.max(kpis.total, 1)) * 100)}%`, change: '+1.8%', icon: Percent, isGood: true },
    { label: 'Avg Transit Time', value: '6.2 days', change: '-0.4d', icon: Clock, isGood: true },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Performance Analytics</h1>
            <p className="text-sm text-text-muted mt-1">Financial insights and predictive intelligence</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass glass-hover px-4 py-2 text-xs font-semibold text-text-secondary flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" /> Export Report
          </motion.button>
        </div>
      </motion.div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {financialKPIs.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -3 }}
              className="glass glass-hover p-6 relative overflow-hidden group"
            >
              <div className="absolute -right-4 -top-4 text-purple-start/5 group-hover:text-purple-start/10 transition-colors">
                <Icon className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">{kpi.label}</p>
                <p className="text-3xl font-bold text-text-primary mb-2">{kpi.value}</p>
                <div className={`flex items-center gap-1 text-sm font-semibold ${kpi.isGood ? 'text-emerald' : 'text-rose'}`}>
                  <TrendingUp className={`w-3.5 h-3.5 ${!kpi.isGood ? 'rotate-180' : ''}`} />
                  {kpi.change}
                  <span className="text-text-muted font-normal text-xs ml-1">vs last quarter</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <AnalyticsPanel />
    </div>
  );
}
