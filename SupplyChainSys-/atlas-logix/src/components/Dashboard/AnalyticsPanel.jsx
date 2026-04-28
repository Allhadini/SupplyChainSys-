import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area, CartesianGrid } from 'recharts';
import { useShipments } from '../../context/ShipmentContext';
import { SkeletonCard } from '../ui';

const COLORS = ['#7c3aed', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="glass p-3 rounded-xl border border-white/[0.08] text-xs">
      <p className="text-text-primary font-semibold mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="font-medium">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPanel() {
  const { regionData, shipments, loading } = useShipments();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonCard lines={5} />
        <SkeletonCard lines={5} />
      </div>
    );
  }

  // Mode distribution data
  const modeData = ['sea', 'air', 'road'].map(mode => ({
    name: mode.charAt(0).toUpperCase() + mode.slice(1),
    value: shipments.filter(s => s.mode === mode).length,
  }));

  // Status over time (mock trend)
  const trendData = [
    { time: '00:00', inTransit: 8, delayed: 2, delivered: 1 },
    { time: '04:00', inTransit: 9, delayed: 1, delivered: 2 },
    { time: '08:00', inTransit: 7, delayed: 3, delivered: 3 },
    { time: '12:00', inTransit: 10, delayed: 2, delivered: 4 },
    { time: '16:00', inTransit: 8, delayed: 1, delivered: 5 },
    { time: '20:00', inTransit: 6, delayed: 2, delivered: 6 },
    { time: 'Now', inTransit: shipments.filter(s => s.status === 'In Transit').length, delayed: shipments.filter(s => s.status === 'Delayed').length, delivered: shipments.filter(s => s.status === 'Delivered').length },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Regional Performance */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-5"
      >
        <h3 className="text-sm font-bold gradient-text mb-4">Regional Performance</h3>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
            <BarChart data={regionData} barGap={4}>
              <XAxis
                dataKey="name"
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={50}
              />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.06)' }} />
              <Bar dataKey="inTransit" name="In Transit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="delayed" name="Delayed" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="delivered" name="Delivered" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Status Trends */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-5"
      >
        <h3 className="text-sm font-bold gradient-text mb-4">Status Trend (24h)</h3>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gradTransit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradDelay" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradDelivered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="inTransit" name="In Transit" stroke="#3b82f6" strokeWidth={2} fill="url(#gradTransit)" />
              <Area type="monotone" dataKey="delayed" name="Delayed" stroke="#ef4444" strokeWidth={2} fill="url(#gradDelay)" />
              <Area type="monotone" dataKey="delivered" name="Delivered" stroke="#10b981" strokeWidth={2} fill="url(#gradDelivered)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Mode Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass p-5"
      >
        <h3 className="text-sm font-bold gradient-text mb-4">Transport Mode Split</h3>
        <div className="h-[200px] flex items-center">
          <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
            <PieChart>
              <Pie
                data={modeData}
                innerRadius={55}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {modeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3 ml-4">
            {modeData.map((m, i) => (
              <div key={m.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                <div>
                  <div className="text-xs font-medium text-text-primary">{m.name}</div>
                  <div className="text-[10px] text-text-muted">{m.value} shipments</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Risk Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass p-5"
      >
        <h3 className="text-sm font-bold gradient-text mb-4">Risk Assessment</h3>
        <div className="space-y-3">
          {shipments
            .filter(s => s.riskScore > 0.4)
            .sort((a, b) => b.riskScore - a.riskScore)
            .slice(0, 5)
            .map(s => (
              <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${s.riskScore > 0.7 ? 'bg-rose' : 'bg-amber'}`} />
                  <div>
                    <div className="text-xs font-mono font-semibold text-text-primary">{s.id}</div>
                    <div className="text-[10px] text-text-muted">{s.carrier}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${s.riskScore > 0.7 ? 'text-rose' : 'text-amber'}`}>
                    {(s.riskScore * 100).toFixed(0)}%
                  </div>
                  <div className="text-[10px] text-text-muted">risk score</div>
                </div>
              </div>
            ))}
        </div>
      </motion.div>
    </div>
  );
}
