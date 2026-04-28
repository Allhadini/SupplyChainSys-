import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { useShipments } from '../../context/ShipmentContext';

const regions = ['All', 'Asia Pacific', 'Europe', 'North America', 'South America', 'Middle East', 'Africa'];
const statuses = ['All', 'In Transit', 'Delivered', 'Delayed', 'Customs Hold'];
const priorities = ['All', 'Normal', 'High', 'Critical'];

export default function FiltersPanel() {
  const { filters, setFilters } = useShipments();
  const hasFilters = filters.region !== 'All' || filters.status !== 'All' || filters.priority !== 'All';

  const clearFilters = () => setFilters({ region: 'All', status: 'All', priority: 'All' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-4 flex flex-wrap items-center gap-4"
    >
      <div className="flex items-center gap-2 text-text-secondary">
        <Filter className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">Filters</span>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-[11px] text-text-muted">Region</label>
        <select
          value={filters.region}
          onChange={(e) => setFilters({ ...filters, region: e.target.value })}
          className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-purple-start/30 transition-colors"
        >
          {regions.map(r => <option key={r} value={r} className="bg-obsidian">{r}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-[11px] text-text-muted">Status</label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-purple-start/30 transition-colors"
        >
          {statuses.map(s => <option key={s} value={s} className="bg-obsidian">{s}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-[11px] text-text-muted">Priority</label>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-purple-start/30 transition-colors"
        >
          {priorities.map(p => <option key={p} value={p} className="bg-obsidian">{p}</option>)}
        </select>
      </div>

      {hasFilters && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={clearFilters}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose/10 text-rose text-[11px] font-medium hover:bg-rose/20 transition-colors"
        >
          <X className="w-3 h-3" />
          Clear
        </motion.button>
      )}
    </motion.div>
  );
}
