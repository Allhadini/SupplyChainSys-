import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './pages/Dashboard';
import FleetMap from './pages/FleetMap';
import Analytics from './pages/Analytics';
import Shipments from './pages/Shipments';
import CriticalAlerts from './pages/CriticalAlerts';
import History from './pages/History';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="fleet-map" element={<FleetMap />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="shipments" element={<Shipments />} />
          <Route path="critical-alerts" element={<CriticalAlerts />} />
          <Route path="history" element={<History />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
