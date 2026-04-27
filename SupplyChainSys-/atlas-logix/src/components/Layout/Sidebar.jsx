import { NavLink } from 'react-router-dom';
import { Home, Map, PieChart, Package, AlertTriangle, Clock } from 'lucide-react';

export default function Sidebar() {
  const routes = [
    { path: '/', name: 'Dashboard', icon: Home },
    { path: '/fleet-map', name: 'Fleet Map', icon: Map },
    { path: '/analytics', name: 'Analytics', icon: PieChart },
    { path: '/shipments', name: 'Shipments', icon: Package },
    { path: '/critical-alerts', name: 'Critical Alerts', icon: AlertTriangle },
    { path: '/history', name: 'History', icon: Clock },
  ];

  return (
    <div className="w-[240px] fixed inset-y-0 left-0 bg-carbon-light border-r border-violet-support p-4 flex flex-col">
      <div className="text-2xl font-bold text-white mb-8 border-b border-violet-support pb-4">
        <span className="text-violet-electric">Atlas</span>-Logix
      </div>
      <nav className="flex-1 space-y-2">
        {routes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-violet-electric text-white' : 'text-soft-gray hover:bg-violet-hover hover:text-white'
              }`
            }
          >
            <route.icon className="w-5 h-5" />
            <span>{route.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
