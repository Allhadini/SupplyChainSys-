import { useState, useEffect } from 'react';
import { fleetVehicles } from '../data/mockData';
import { Badge } from '../components/ui';
import { Truck, MapPin, Navigation, Activity, Zap } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon issue in react
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function MapUpdater({ selectedLocation }) {
  const map = useMap();
  useEffect(() => {
    if (selectedLocation) {
      map.flyTo([selectedLocation.lat, selectedLocation.lng], 8);
    }
  }, [selectedLocation, map]);
  return null;
}

export default function FleetMap() {
  const [selectedTruck, setSelectedTruck] = useState(fleetVehicles[0]);
  const [showTraffic, setShowTraffic] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 stagger-children">
      {/* Map View Pane */}
      <div className="flex-1 glass-card relative overflow-hidden flex flex-col group rounded-xl z-0">
        <MapContainer 
           center={[39.8283, -98.5795]} // Center of US
           zoom={4} 
           style={{ height: '100%', width: '100%', background: '#0F1417' }}
           zoomControl={false}
        >
           {/* Dark map tiles (CartoDB Dark Matter) */}
           <TileLayer
             url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
           />
           
           <MapUpdater selectedLocation={selectedTruck?.location} />

           {fleetVehicles.map(truck => (
             <Marker 
                key={truck.id} 
                position={[truck.location.lat, truck.location.lng]}
                eventHandlers={{
                  click: () => {
                    setSelectedTruck(truck);
                  },
                }}
             >
                <Popup className="custom-popup">
                   <div className="text-carbon font-bold">{truck.id}</div>
                   <div>Status: {truck.status}</div>
                </Popup>
             </Marker>
           ))}
           
           {/* Mock Traffic Layers */}
           {showTraffic && fleetVehicles.map((t, idx) => (
               <CircleMarker 
                   key={`traffic-${idx}`}
                   center={[t.location.lat + (Math.random()*0.1 - 0.05), t.location.lng + (Math.random()*0.1 - 0.05)]}
                   radius={15}
                   pathOptions={{ color: t.speed < 10 ? 'red' : 'orange', fillColor: t.speed < 10 ? 'red' : 'orange', fillOpacity: 0.3 }}
               />
           ))}

           {/* AI Optimized Routes Layer */}
           {showRoutes && fleetVehicles.map((t, idx) => (
               <Polyline 
                   key={`route-${idx}`}
                   positions={[
                      [t.location.lat, t.location.lng],
                      [t.location.lat + 0.5, t.location.lng + 0.5],
                      [t.location.lat + 0.8, t.location.lng + 0.2]
                   ]}
                   pathOptions={{ color: '#53E6D4', weight: 4, opacity: 0.8, dashArray: '10, 10' }}
               />
           ))}
        </MapContainer>
        
        {/* Toggles overlays */}
        {/* Toggles overlays */}
        <div className="absolute top-4 right-4 flex space-x-2 z-[400]">
            <button 
                onClick={() => setShowTraffic(!showTraffic)}
                className={`glass-card px-4 py-2 text-sm font-medium transition-colors flex items-center shadow-lg ${showTraffic ? 'bg-violet-electric text-white' : 'hover:bg-violet-support text-white bg-carbon/80'}`}
            >
                <Activity className="w-4 h-4 mr-2" /> Live Traffic: {showTraffic ? 'ON' : 'OFF'}
            </button>
            <button 
                onClick={() => setShowRoutes(!showRoutes)}
                className={`glass-card px-4 py-2 text-sm font-medium transition-colors flex items-center shadow-lg ${showRoutes ? 'bg-mint text-carbon' : 'hover:bg-violet-support text-white bg-carbon/80'}`}
            >
                <Zap className="w-4 h-4 mr-2" /> AI Routes: {showRoutes ? 'ON' : 'OFF'}
            </button>
        </div>
      </div>

      {/* Telemetry Sidebar */}
      <div className="w-full lg:w-80 flex flex-col space-y-4">
        <div className="glass-card p-5">
           <h3 className="text-lg font-heading font-bold mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2 text-violet-electric" /> Asset Telemetry
           </h3>
           {selectedTruck ? (
             <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center pb-4 border-b border-violet-support">
                   <div>
                     <div className="text-sm text-soft-gray uppercase tracking-wider font-semibold">Vehicle ID</div>
                     <div className="text-xl font-bold text-white mt-1">{selectedTruck.id}</div>
                   </div>
                   <Badge variant={selectedTruck.status}>{selectedTruck.status}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-carbon-light rounded-lg p-3 border border-violet-support">
                      <div className="text-xs text-soft-gray mb-1">Speed</div>
                      <div className="text-lg font-bold text-mint">{selectedTruck.speed} <span className="text-sm font-normal text-soft-gray">mph</span></div>
                   </div>
                   <div className="bg-carbon-light rounded-lg p-3 border border-violet-support">
                      <div className="text-xs text-soft-gray mb-1">Heading</div>
                      <div className="text-lg font-bold text-white">NW <span className="text-sm font-normal text-soft-gray">315°</span></div>
                   </div>
                </div>

                <div>
                   <div className="flex justify-between text-sm mb-2">
                      <span className="text-soft-gray">Fuel / Charge Level</span>
                      <span className="font-bold text-white">{selectedTruck.fuel}%</span>
                   </div>
                   <div className="w-full bg-carbon rounded-full h-2.5 outline outline-1 outline-violet-support">
                     <div className="bg-gradient-to-r from-violet-electric to-mint h-2.5 rounded-full" style={{ width: `${selectedTruck.fuel}%` }}></div>
                   </div>
                </div>
                
                <button className="w-full btn-secondary mt-4 flex items-center justify-center">
                  Ping Driver <Navigation className="w-4 h-4 ml-2" />
                </button>
             </div>
           ) : (
             <div className="text-soft-gray text-center py-8">Select a vehicle on the map to view live telemetry.</div>
           )}
        </div>
        
        {/* Active Units list */}
        <div className="glass-card flex-1 p-5 overflow-hidden flex flex-col">
            <h3 className="text-lg font-heading font-bold mb-3">Active Units ({fleetVehicles.length})</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
               {fleetVehicles.map(t => (
                  <div key={t.id} onClick={() => setSelectedTruck(t)} className={`p-3 rounded-lg border cursor-pointer transition-colors flex justify-between items-center ${selectedTruck?.id === t.id ? 'bg-violet-support/50 border-violet-electric' : 'bg-carbon border-transparent hover:border-violet-support'}`}>
                     <span className="font-mono text-sm">{t.id}</span>
                     <div className={`w-2 h-2 rounded-full ${t.status === 'Active' ? 'bg-mint' : 'bg-yellow-500'}`}></div>
                  </div>
               ))}
            </div>
        </div>
      </div>
    </div>
  );
}
