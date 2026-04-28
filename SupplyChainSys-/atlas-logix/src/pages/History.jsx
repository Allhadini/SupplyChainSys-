import { motion } from 'framer-motion';
import { useShipments } from '../context/ShipmentContext';
import { Badge } from '../components/ui';
import { Clock, Search, Radio, Package, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function History() {
  const { feedEvents, shipments } = useShipments();
  const [activeTab, setActiveTab] = useState('events');
  const [searchQuery, setSearchQuery] = useState('');

  const deliveredShipments = shipments.filter(s => s.status === 'Delivered');

  const filteredEvents = feedEvents.filter(e =>
    e.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold gradient-text">Activity History</h1>
        <p className="text-sm text-text-muted mt-1">Complete audit trail of logistics events and deliveries</p>
      </motion.div>

      {/* Tab bar */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex space-x-1 glass p-1 rounded-xl w-max">
          {[
            { key: 'events', label: 'Event Log', icon: Radio },
            { key: 'delivered', label: 'Completed', icon: CheckCircle },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-purple-start/20 to-blue-end/10 text-text-primary border border-purple-start/20'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass p-4">
        <div className="flex items-center glass-subtle px-3 py-2 rounded-xl group focus-within:border-purple-start/30 transition-all">
          <Search className="w-4 h-4 text-text-muted mr-2 group-focus-within:text-purple-start transition-colors" />
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-sm text-text-primary focus:outline-none w-full placeholder:text-text-muted"
          />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass overflow-hidden">
        {activeTab === 'events' && (
          <div className="max-h-[500px] overflow-y-auto">
            {filteredEvents.length > 0 ? filteredEvents.map((event, i) => {
              const typeColors = {
                warning: 'border-l-amber text-amber',
                success: 'border-l-emerald text-emerald',
                info: 'border-l-blue-400 text-blue-400',
              };
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className={`flex items-center justify-between px-6 py-3.5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors border-l-2 ${
                    typeColors[event.type]?.split(' ')[0] || 'border-l-blue-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                    <span className="text-xs text-text-secondary">{event.message}</span>
                  </div>
                  <span className="text-[10px] text-text-muted font-mono whitespace-nowrap ml-4">{event.timestamp}</span>
                </motion.div>
              );
            }) : (
              <div className="p-12 text-center text-text-muted">
                <Radio className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No events match your search</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'delivered' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left data-table">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="py-3.5 px-6 text-[10px] font-semibold text-text-muted uppercase tracking-wider">Shipment ID</th>
                  <th className="py-3.5 px-6 text-[10px] font-semibold text-text-muted uppercase tracking-wider">Carrier</th>
                  <th className="py-3.5 px-6 text-[10px] font-semibold text-text-muted uppercase tracking-wider">Route</th>
                  <th className="py-3.5 px-6 text-[10px] font-semibold text-text-muted uppercase tracking-wider">Cargo</th>
                  <th className="py-3.5 px-6 text-[10px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {deliveredShipments.map((s, i) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/[0.03]"
                  >
                    <td className="py-3.5 px-6 font-mono text-xs font-bold text-emerald">{s.id}</td>
                    <td className="py-3.5 px-6 text-xs text-text-primary">{s.carrier}</td>
                    <td className="py-3.5 px-6 text-xs text-text-secondary">{s.origin} → {s.destination}</td>
                    <td className="py-3.5 px-6 text-xs text-text-muted">{s.cargo}</td>
                    <td className="py-3.5 px-6"><Badge variant="delivered">Delivered</Badge></td>
                  </motion.tr>
                ))}
                {deliveredShipments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-text-muted text-sm">
                      <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      No completed deliveries yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
