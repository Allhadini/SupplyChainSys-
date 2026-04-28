import { motion, AnimatePresence } from 'framer-motion';
import { Radio } from 'lucide-react';
import { useShipments } from '../../context/ShipmentContext';

export default function LiveFeed() {
  const { feedEvents } = useShipments();
  const events = feedEvents.slice(0, 15);

  const typeColors = {
    warning: 'border-l-amber',
    success: 'border-l-emerald',
    info: 'border-l-blue-400',
  };

  return (
    <div className="glass p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose animate-pulse-dot" />
          <h3 className="text-sm font-bold gradient-text">Live Activity Feed</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
          <Radio className="w-3 h-3 text-emerald" />
          <span>Real-time</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        <AnimatePresence initial={false}>
          {events.length > 0 ? events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`px-3 py-2.5 rounded-lg border-l-2 ${typeColors[event.type] || 'border-l-blue-400'} bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer`}
            >
              <p className="text-[12px] text-text-secondary leading-relaxed">{event.message}</p>
              <span className="text-[10px] text-text-muted mt-1 block">{event.timestamp}</span>
            </motion.div>
          )) : (
            <div className="flex flex-col items-center justify-center h-full text-text-muted text-sm py-8">
              <Radio className="w-6 h-6 mb-2 opacity-30" />
              <p>Awaiting live events...</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
