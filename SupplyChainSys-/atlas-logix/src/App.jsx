import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShipmentProvider } from './context/ShipmentContext';
import AppLayout from './components/Layout/AppLayout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import FleetMap from './pages/FleetMap';
import Analytics from './pages/Analytics';
import Shipments from './pages/Shipments';
import CriticalAlerts from './pages/CriticalAlerts';
import History from './pages/History';

export default function App() {
  return (
    <ShipmentProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing page — no layout shell */}
          <Route index element={<Landing />} />

          {/* Dashboard pages — wrapped in AppLayout */}
          <Route path="dashboard" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="global-map" element={<FleetMap />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="shipments" element={<Shipments />} />
            <Route path="alerts" element={<CriticalAlerts />} />
            <Route path="history" element={<History />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ShipmentProvider>
  );
}
