import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Globe, X } from 'lucide-react';
import { useShipments } from '../../context/ShipmentContext';
import { worldClocks } from '../../data/mockData';

export default function Header() {
  const { feedEvents, kpis } = useShipments();
  const [showNotif, setShowNotif] = useState(false);
  const [showClocks, setShowClocks] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [clockTimes, setClockTimes] = useState({});
  const notifRef = useRef(null);

  // Update clocks every second
  useEffect(() => {
    const update = () => {
      const times = {};
      worldClocks.forEach(c => {
        times[c.city] = new Date().toLocaleTimeString('en-US', {
          timeZone: c.tz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
      });
      setClockTimes(times);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close notifications on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const recentEvents = feedEvents.slice(0, 8);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.06] bg-obsidian/60 backdrop-blur-xl sticky top-0 z-20">
      {/* Search */}
      <div className="flex items-center glass-subtle px-3.5 py-2 rounded-xl w-80 group focus-within:border-purple-start/30 transition-all">
        <Search className="w-4 h-4 text-text-muted mr-2.5 group-focus-within:text-purple-start transition-colors" />
        <input
          type="text"
          placeholder="Search shipments, carriers, routes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none text-sm text-text-primary focus:outline-none w-full placeholder:text-text-muted"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-text-muted hover:text-text-primary">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* World Clocks toggle */}
        <div className="relative">
          <button
            onClick={() => setShowClocks(!showClocks)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.03] transition-all"
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs font-mono">{clockTimes['London'] || '--:--:--'}</span>
          </button>

          <AnimatePresence>
            {showClocks && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 glass rounded-xl border border-white/[0.06] shadow-2xl w-64 overflow-hidden"
              >
                <div className="p-3 border-b border-white/[0.06]">
                  <span className="text-xs font-semibold gradient-text">Global Timezone Clocks</span>
                </div>
                <div className="p-2">
                  {worldClocks.map(c => (
                    <div key={c.city} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{c.flag}</span>
                        <span className="text-xs text-text-secondary">{c.city}</span>
                      </div>
                      <span className="text-xs font-mono text-text-primary font-medium">{clockTimes[c.city] || '--:--:--'}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.03] transition-all"
          >
            <Bell className="w-[18px] h-[18px]" />
            {kpis.delayed > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose text-white text-[9px] font-bold flex items-center justify-center animate-pulse-dot">
                {kpis.delayed}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 glass rounded-xl border border-white/[0.06] shadow-2xl w-96 max-h-[420px] overflow-hidden flex flex-col"
              >
                <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                  <span className="text-sm font-bold gradient-text">Live Feed</span>
                  <span className="text-[10px] font-semibold text-emerald bg-emerald/10 px-2 py-0.5 rounded-full">
                    {recentEvents.length} events
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {recentEvents.length > 0 ? recentEvents.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs text-text-secondary leading-relaxed">{event.message}</p>
                        <span className="text-[10px] text-text-muted whitespace-nowrap">{event.timestamp}</span>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="p-8 text-center text-text-muted text-sm">Waiting for events...</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-start to-blue-end flex items-center justify-center shadow-lg shadow-purple-start/20 cursor-pointer hover:shadow-purple-start/40 transition-shadow">
          <span className="text-white text-xs font-bold">SC</span>
        </div>
      </div>
    </header>
  );
}
