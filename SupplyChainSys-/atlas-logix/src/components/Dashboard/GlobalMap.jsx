import { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useShipments } from '../../context/ShipmentContext';
import { Badge, ProgressBar } from '../ui';
import { MapPin, Navigation, Maximize2, Layers } from 'lucide-react';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom marker icons
function createCustomIcon(color, size = 10) {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px; height: ${size}px;
        background: ${color};
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.3);
        box-shadow: 0 0 12px ${color}80, 0 0 24px ${color}40;
        position: relative;
      ">
        <div style="
          position: absolute; inset: -4px; border-radius: 50%;
          border: 1px solid ${color}40;
          animation: pulse-dot 2s ease-in-out infinite;
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// Generate curved path between two points (Great Circle approximation)
function generateCurvedPath(startLat, startLng, endLat, endLng, points = 50, mode = 'sea') {
  const path = [];
  const curveHeight = mode === 'air' ? 0.3 : mode === 'sea' ? 0.15 : 0.05;

  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const lat = startLat + (endLat - startLat) * t;
    const lng = startLng + (endLng - startLng) * t;
    // Add curve offset using sine wave
    const offset = Math.sin(t * Math.PI) * curveHeight * Math.abs(endLat - startLat + endLng - startLng);
    path.push([lat + offset, lng]);
  }
  return path;
}

// Map auto-updater
function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom || map.getZoom(), { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export default function GlobalMap({ height = '100%', minimal = false }) {
  const { filteredShipments } = useShipments();
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showRoutes, setShowRoutes] = useState(true);
  const [mapCenter, setMapCenter] = useState(null);

  const statusColors = {
    'In Transit': '#3b82f6',
    'Delivered': '#10b981',
    'Delayed': '#ef4444',
    'Customs Hold': '#f59e0b',
  };

  const modePathStyles = {
    sea: { dashArray: null, weight: 2, opacity: 0.4 },
    air: { dashArray: '8, 8', weight: 1.5, opacity: 0.35 },
    road: { dashArray: '4, 4', weight: 2, opacity: 0.3 },
  };

  const paths = useMemo(() => {
    if (!showRoutes) return [];
    return filteredShipments.map(s => ({
      id: s.id,
      path: generateCurvedPath(s.originLat, s.originLng, s.destLat, s.destLng, 50, s.mode),
      color: statusColors[s.status] || '#3b82f6',
      style: modePathStyles[s.mode] || modePathStyles.sea,
    }));
  }, [filteredShipments, showRoutes]);

  return (
    <div className="relative w-full" style={{ height }}>
      <MapContainer
        center={[20, 10]}
        zoom={2.5}
        minZoom={2}
        maxZoom={12}
        style={{ height: '100%', width: '100%', background: '#0a0a0f', borderRadius: '16px' }}
        zoomControl={false}
        worldCopyJump={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {mapCenter && <MapUpdater center={mapCenter} zoom={6} />}

        {/* Route paths */}
        {paths.map(p => (
          <Polyline
            key={p.id}
            positions={p.path}
            pathOptions={{
              color: p.color,
              weight: p.style.weight,
              opacity: p.style.opacity,
              dashArray: p.style.dashArray,
            }}
          />
        ))}

        {/* Origin markers */}
        {filteredShipments.map(s => (
          <CircleMarker
            key={`origin-${s.id}`}
            center={[s.originLat, s.originLng]}
            radius={3}
            pathOptions={{
              color: '#7c3aed',
              fillColor: '#7c3aed',
              fillOpacity: 0.6,
              weight: 1,
            }}
          />
        ))}

        {/* Destination markers */}
        {filteredShipments.map(s => (
          <CircleMarker
            key={`dest-${s.id}`}
            center={[s.destLat, s.destLng]}
            radius={3}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.6,
              weight: 1,
            }}
          />
        ))}

        {/* Current position markers (animated) */}
        {filteredShipments.filter(s => s.status !== 'Delivered').map(s => (
          <Marker
            key={`current-${s.id}`}
            position={[s.currentLat, s.currentLng]}
            icon={createCustomIcon(statusColors[s.status] || '#3b82f6', 12)}
            eventHandlers={{
              click: () => {
                setSelectedShipment(s);
                setMapCenter([s.currentLat, s.currentLng]);
              },
            }}
          >
            <Popup>
              <div className="min-w-[220px] p-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">{s.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    s.status === 'Delayed' ? 'bg-red-500/20 text-red-400' :
                    s.status === 'In Transit' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>{s.status}</span>
                </div>
                <div className="text-[11px] space-y-1 text-gray-300">
                  <div>📦 {s.carrier} • {s.mode.toUpperCase()}</div>
                  <div>🚀 {s.origin} → {s.destination}</div>
                  <div>📊 Progress: {Math.round(s.progress)}%</div>
                  <div>🕐 ETA: {new Date(s.eta).toLocaleDateString()}</div>
                  {s.predictedDelay > 0 && (
                    <div className="text-red-400 font-semibold">⚠️ +{s.predictedDelay}h predicted delay</div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map controls overlay */}
      {!minimal && (
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-[400]">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRoutes(!showRoutes)}
            className={`glass px-3 py-2 text-xs font-medium flex items-center gap-2 transition-all ${
              showRoutes ? 'border-purple-start/30 text-purple-start' : 'text-text-secondary'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Routes {showRoutes ? 'ON' : 'OFF'}
          </motion.button>
        </div>
      )}

      {/* Selected shipment panel */}
      {!minimal && selectedShipment && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-4 left-4 glass p-4 w-72 z-[400] rounded-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-sm font-mono gradient-text">{selectedShipment.id}</span>
            <Badge variant={selectedShipment.status} pulse>{selectedShipment.status}</Badge>
          </div>
          <div className="space-y-2 text-xs text-text-secondary">
            <div className="flex justify-between">
              <span>Carrier</span>
              <span className="text-text-primary font-medium">{selectedShipment.carrier}</span>
            </div>
            <div className="flex justify-between">
              <span>Route</span>
              <span className="text-text-primary font-medium truncate ml-2">{selectedShipment.origin} → {selectedShipment.destination}</span>
            </div>
            <div className="flex justify-between">
              <span>Cargo</span>
              <span className="text-text-primary font-medium">{selectedShipment.cargo}</span>
            </div>
          </div>
          <div className="mt-3">
            <ProgressBar value={selectedShipment.progress} size="sm" color={selectedShipment.status === 'Delayed' ? 'rose' : 'purple'} />
          </div>
          <button
            onClick={() => setSelectedShipment(null)}
            className="mt-3 w-full text-center text-[11px] text-text-muted hover:text-text-primary transition-colors"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Legend */}
      {!minimal && (
        <div className="absolute bottom-4 right-4 glass p-3 z-[400] rounded-xl">
          <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Legend</div>
          <div className="space-y-1.5">
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}60` }} />
                <span className="text-[11px] text-text-secondary">{status}</span>
              </div>
            ))}
            <div className="border-t border-white/[0.05] pt-1.5 mt-1.5 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-0 border-t border-white/40" />
                <span className="text-[10px] text-text-muted">Sea route</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-0 border-t border-dashed border-white/40" />
                <span className="text-[10px] text-text-muted">Air route</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
