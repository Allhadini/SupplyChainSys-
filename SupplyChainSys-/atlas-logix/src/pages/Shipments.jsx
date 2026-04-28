import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShipments } from '../context/ShipmentContext';
import { Badge, Modal, ProgressBar } from '../components/ui';
import { Search, Package, MapPin, Clock, Anchor, Plane, Truck, ChevronDown, ArrowUpDown } from 'lucide-react';

const modeIcons = { sea: Anchor, air: Plane, road: Truck };

export default function Shipments() {
  const { filteredShipments } = useShipments();
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('status');
  const [sortDir, setSortDir] = useState('asc');

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const searched = filteredShipments.filter(s =>
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.carrier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sorted = [...searched].sort((a, b) => {
    const aVal = a[sortField] || '';
    const bVal = b[sortField] || '';
    if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  const formatETA = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
           d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold gradient-text">Shipment Registry</h1>
        <p className="text-sm text-text-muted mt-1">Complete manifest of all tracked logistics operations</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center glass-subtle px-3 py-2 rounded-xl flex-1 group focus-within:border-purple-start/30 transition-all">
            <Search className="w-4 h-4 text-text-muted mr-2 group-focus-within:text-purple-start transition-colors" />
            <input
              type="text"
              placeholder="Search by ID, carrier, origin, destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-sm text-text-primary focus:outline-none w-full placeholder:text-text-muted"
            />
          </div>
          <div className="text-xs text-text-muted">
            {sorted.length} of {filteredShipments.length} shown
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left data-table">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                {[
                  { key: 'id', label: 'Shipment ID' },
                  { key: 'carrier', label: 'Carrier' },
                  { key: 'origin', label: 'Origin' },
                  { key: 'destination', label: 'Destination' },
                  { key: 'mode', label: 'Mode' },
                  { key: 'status', label: 'Status' },
                  { key: 'progress', label: 'Progress' },
                  { key: 'eta', label: 'ETA' },
                  { key: 'priority', label: 'Priority' },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="py-3.5 px-4 text-[10px] font-semibold text-text-muted uppercase tracking-wider cursor-pointer hover:text-text-secondary transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sortField === col.key && <ArrowUpDown className="w-3 h-3 text-purple-start" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((s, i) => {
                const ModeIcon = modeIcons[s.mode] || Package;
                return (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => setSelectedShipment(s)}
                    className="border-b border-white/[0.03] cursor-pointer hover:bg-purple-start/[0.04] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-purple-start">{s.id}</td>
                    <td className="py-3.5 px-4 text-xs text-text-primary">{s.carrier}</td>
                    <td className="py-3.5 px-4 text-xs text-text-secondary">{s.origin}</td>
                    <td className="py-3.5 px-4 text-xs text-text-secondary">{s.destination}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <ModeIcon className="w-3 h-3 text-text-muted" />
                        <span className="text-xs text-text-secondary capitalize">{s.mode}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4"><Badge variant={s.status} pulse={s.status === 'In Transit'}>{s.status}</Badge></td>
                    <td className="py-3.5 px-4 w-32">
                      <ProgressBar value={s.progress} size="sm" showLabel={false} color={s.status === 'Delayed' ? 'rose' : 'purple'} />
                    </td>
                    <td className="py-3.5 px-4 text-xs text-text-secondary font-mono">{formatETA(s.eta)}</td>
                    <td className="py-3.5 px-4"><Badge variant={s.priority}>{s.priority}</Badge></td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedShipment} onClose={() => setSelectedShipment(null)} title="Shipment Details">
        {selectedShipment && (
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xl font-mono font-bold gradient-text">{selectedShipment.id}</h4>
                <p className="text-sm text-text-muted mt-0.5">{selectedShipment.carrier}</p>
              </div>
              <Badge variant={selectedShipment.status} pulse>{selectedShipment.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Origin', value: selectedShipment.origin },
                { label: 'Destination', value: selectedShipment.destination },
                { label: 'Cargo', value: selectedShipment.cargo },
                { label: 'Weight', value: selectedShipment.weight },
                { label: 'Containers', value: selectedShipment.containers },
                { label: 'Mode', value: selectedShipment.mode.toUpperCase() },
                { label: 'Region', value: selectedShipment.region },
                { label: 'ETA', value: formatETA(selectedShipment.eta) },
              ].map(item => (
                <div key={item.label} className="glass-subtle p-3 rounded-xl">
                  <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{item.label}</div>
                  <div className="text-sm font-semibold text-text-primary">{item.value}</div>
                </div>
              ))}
            </div>

            <ProgressBar value={selectedShipment.progress} color={selectedShipment.status === 'Delayed' ? 'rose' : 'purple'} />

            {selectedShipment.predictedDelay > 0 && (
              <div className="glass-subtle p-3 rounded-xl border border-rose/20 bg-rose/5">
                <div className="flex items-center gap-2 text-rose text-sm font-semibold">
                  <Clock className="w-4 h-4" />
                  Predicted delay: +{selectedShipment.predictedDelay} hours
                </div>
                <p className="text-xs text-text-muted mt-1">Based on current speed and route conditions</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
