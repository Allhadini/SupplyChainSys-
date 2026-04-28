import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { shipments as initialShipments, updateShipments, computeKPIs, computeRegionData, generateFeedEvent } from '../data/mockData';

const ShipmentContext = createContext(null);

export function ShipmentProvider({ children }) {
  const [shipments, setShipments] = useState(initialShipments);
  const [kpis, setKpis] = useState(() => computeKPIs(initialShipments));
  const [regionData, setRegionData] = useState(() => computeRegionData(initialShipments));
  const [feedEvents, setFeedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ region: 'All', status: 'All', priority: 'All' });
  const intervalRef = useRef(null);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Real-time polling — update every 3 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setShipments(prev => {
        const updated = updateShipments(prev);
        setKpis(computeKPIs(updated));
        setRegionData(computeRegionData(updated));

        // Generate a random live feed event
        const randomShipment = updated[Math.floor(Math.random() * updated.length)];
        const event = generateFeedEvent(randomShipment);
        setFeedEvents(prevFeed => [event, ...prevFeed].slice(0, 50));

        return updated;
      });
    }, 3000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const filteredShipments = shipments.filter(s => {
    if (filters.region !== 'All' && s.region !== filters.region) return false;
    if (filters.status !== 'All' && s.status !== filters.status) return false;
    if (filters.priority !== 'All' && s.priority !== filters.priority) return false;
    return true;
  });

  const value = {
    shipments,
    filteredShipments,
    kpis,
    regionData,
    feedEvents,
    loading,
    filters,
    setFilters,
  };

  return (
    <ShipmentContext.Provider value={value}>
      {children}
    </ShipmentContext.Provider>
  );
}

export function useShipments() {
  const ctx = useContext(ShipmentContext);
  if (!ctx) throw new Error('useShipments must be used within ShipmentProvider');
  return ctx;
}
