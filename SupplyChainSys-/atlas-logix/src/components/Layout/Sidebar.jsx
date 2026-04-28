import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Globe2, BarChart3, Package, AlertTriangle,
  Clock, ChevronLeft, ChevronRight, Zap
} from 'lucide-react';
import { useState } from 'react';
import { useShipments } from '../../context/ShipmentContext';

const navItems = [
  { path: '/dashboard', name: 'Command Center', icon: LayoutDashboard },
  { path: '/dashboard/global-map', name: 'Global Map', icon: Globe2 },
  { path: '/dashboard/analytics', name: 'Analytics', icon: BarChart3 },
  { path: '/dashboard/shipments', name: 'Shipments', icon: Package },
  { path: '/dashboard/alerts', name: 'Risk Alerts', icon: AlertTriangle },
  { path: '/dashboard/history', name: 'History', icon: Clock },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { kpis } = useShipments();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-y-0 left-0 z-30 flex flex-col border-r border-white/[0.06] bg-obsidian/80 backdrop-blur-2xl"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-start to-blue-end flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-start/20">
            <Zap className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              <span className="text-sm font-bold gradient-text tracking-tight leading-none">SupplyChainSys</span>
              <span className="text-[10px] text-text-muted mt-0.5">Logistics Command</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const hasAlert = item.name === 'Risk Alerts' && kpis.delayed > 0;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="block"
            >
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-purple-start/15 to-blue-end/10 text-white border border-purple-start/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.03]'
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-purple-start to-blue-end"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-purple-start' : ''}`} />
                {!collapsed && (
                  <span className="text-[13px] font-medium truncate">{item.name}</span>
                )}
                {hasAlert && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-rose/20 text-rose text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {kpis.delayed}
                  </span>
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-white/[0.06]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.03] transition-all text-xs"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
        </button>
      </div>

      {/* Status footer */}
      {!collapsed && (
        <div className="px-4 pb-4">
          <div className="glass-subtle p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald animate-pulse-dot" />
              <span className="text-[11px] text-text-secondary font-medium">System Online</span>
            </div>
            <div className="text-[10px] text-text-muted">
              Tracking {kpis.total} shipments • {kpis.inTransit} active
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
