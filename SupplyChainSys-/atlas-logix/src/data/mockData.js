// ─── Shipment Mock Data with Real Coordinates ───

const carriers = ['Maersk Line', 'DHL Global', 'FedEx Freight', 'CMA CGM', 'MSC', 'UPS Logistics', 'Hapag-Lloyd', 'COSCO Shipping', 'Evergreen Marine', 'Yang Ming'];
const statuses = ['In Transit', 'In Transit', 'In Transit', 'Delivered', 'Delayed', 'In Transit', 'Customs Hold'];
const priorities = ['Normal', 'Normal', 'High', 'Normal', 'Critical', 'Normal', 'High'];
const modes = ['sea', 'air', 'road', 'sea', 'air'];

const routes = [
  { origin: 'Shanghai, CN', dest: 'Rotterdam, NL', oLat: 31.23, oLng: 121.47, dLat: 51.92, dLng: 4.48 },
  { origin: 'Los Angeles, US', dest: 'Tokyo, JP', oLat: 33.94, oLng: -118.41, dLat: 35.68, dLng: 139.69 },
  { origin: 'Singapore, SG', dest: 'Dubai, AE', oLat: 1.35, oLng: 103.82, dLat: 25.20, dLng: 55.27 },
  { origin: 'Hamburg, DE', dest: 'New York, US', oLat: 53.55, oLng: 9.99, dLat: 40.71, dLng: -74.01 },
  { origin: 'Mumbai, IN', dest: 'Sydney, AU', oLat: 19.08, oLng: 72.88, dLat: -33.87, dLng: 151.21 },
  { origin: 'Santos, BR', dest: 'Antwerp, BE', oLat: -23.96, oLng: -46.33, dLat: 51.22, dLng: 4.40 },
  { origin: 'Busan, KR', dest: 'Vancouver, CA', oLat: 35.18, oLng: 129.08, dLat: 49.28, dLng: -123.12 },
  { origin: 'Felixstowe, UK', dest: 'Lagos, NG', oLat: 51.96, oLng: 1.35, dLat: 6.45, dLng: 3.40 },
  { origin: 'Jeddah, SA', dest: 'Mombasa, KE', oLat: 21.49, oLng: 39.19, dLat: -4.04, dLng: 39.67 },
  { origin: 'Yokohama, JP', dest: 'Long Beach, US', oLat: 35.44, oLng: 139.64, dLat: 33.77, dLng: -118.19 },
  { origin: 'Shenzhen, CN', dest: 'Hamburg, DE', oLat: 22.54, oLng: 114.05, dLat: 53.55, dLng: 9.99 },
  { origin: 'Colombo, LK', dest: 'Durban, ZA', oLat: 6.93, oLng: 79.85, dLat: -29.86, dLng: 31.03 },
  { origin: 'Piraeus, GR', dest: 'Algiers, DZ', oLat: 37.94, oLng: 23.65, dLat: 36.75, dLng: 3.06 },
  { origin: 'Ningbo, CN', dest: 'Seattle, US', oLat: 29.87, oLng: 121.55, dLat: 47.61, dLng: -122.33 },
  { origin: 'Tanjung Pelepas, MY', dest: 'Chennai, IN', oLat: 1.37, oLng: 103.55, dLat: 13.08, dLng: 80.27 },
];

function generateShipmentId() {
  const prefix = ['SCX', 'SCS', 'GLB', 'FRT'][Math.floor(Math.random() * 4)];
  const num = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${num}`;
}

function hoursFromNow(h) {
  const d = new Date();
  d.setHours(d.getHours() + h);
  return d.toISOString();
}

function generateProgress() {
  return Math.floor(Math.random() * 85) + 10;
}

export function generateShipments() {
  return routes.map((route, i) => {
    const status = statuses[i % statuses.length];
    const progress = status === 'Delivered' ? 100 : generateProgress();
    const etaHours = status === 'Delivered' ? 0 : Math.floor(Math.random() * 120) + 12;
    const mode = modes[i % modes.length];
    const isDelayed = status === 'Delayed';

    // Interpolate current position based on progress
    const currentLat = route.oLat + (route.dLat - route.oLat) * (progress / 100);
    const currentLng = route.oLng + (route.dLng - route.oLng) * (progress / 100);

    return {
      id: generateShipmentId(),
      carrier: carriers[i % carriers.length],
      status,
      priority: isDelayed ? 'Critical' : priorities[i % priorities.length],
      mode,
      eta: hoursFromNow(etaHours),
      origin: route.origin,
      destination: route.dest,
      originLat: route.oLat,
      originLng: route.oLng,
      destLat: route.dLat,
      destLng: route.dLng,
      currentLat,
      currentLng,
      progress,
      cargo: ['Electronics', 'Auto Parts', 'Textiles', 'Chemicals', 'Food & Bev', 'Machinery', 'Pharmaceuticals', 'Raw Materials'][i % 8],
      weight: `${(Math.random() * 40 + 5).toFixed(1)}t`,
      containers: Math.floor(Math.random() * 12) + 1,
      lastUpdate: new Date().toISOString(),
      predictedDelay: isDelayed ? Math.floor(Math.random() * 48) + 4 : 0,
      riskScore: isDelayed ? Math.random() * 0.4 + 0.6 : Math.random() * 0.4,
      region: ['Asia Pacific', 'Europe', 'North America', 'South America', 'Middle East', 'Africa'][i % 6],
    };
  });
}

// Initial data
export let shipments = generateShipments();

// Simulate real-time updates
export function updateShipments(prev) {
  return prev.map(s => {
    if (s.status === 'Delivered') return s;

    const progressDelta = Math.random() * 2;
    const newProgress = Math.min(s.progress + progressDelta, 100);
    const newStatus = newProgress >= 100 ? 'Delivered' : s.status;

    const currentLat = s.originLat + (s.destLat - s.originLat) * (newProgress / 100);
    const currentLng = s.originLng + (s.destLng - s.originLng) * (newProgress / 100);

    // Predictive ETA recalculation
    const remainingPct = 100 - newProgress;
    const baseSpeed = s.mode === 'air' ? 8 : s.mode === 'sea' ? 2 : 4; // pct/hour
    const predictedHours = remainingPct / baseSpeed;
    const newEta = new Date();
    newEta.setHours(newEta.getHours() + Math.round(predictedHours));

    return {
      ...s,
      progress: newProgress,
      status: newStatus,
      currentLat: currentLat + (Math.random() - 0.5) * 0.1,
      currentLng: currentLng + (Math.random() - 0.5) * 0.1,
      eta: newEta.toISOString(),
      lastUpdate: new Date().toISOString(),
      riskScore: Math.max(0, Math.min(1, s.riskScore + (Math.random() - 0.5) * 0.05)),
    };
  });
}

// KPI computation
export function computeKPIs(data) {
  const total = data.length;
  const inTransit = data.filter(s => s.status === 'In Transit').length;
  const delivered = data.filter(s => s.status === 'Delivered').length;
  const delayed = data.filter(s => s.status === 'Delayed').length;
  const customsHold = data.filter(s => s.status === 'Customs Hold').length;
  const avgProgress = data.reduce((a, s) => a + s.progress, 0) / total;

  return { total, inTransit, delivered, delayed, customsHold, avgProgress: Math.round(avgProgress) };
}

// Region analytics
export function computeRegionData(data) {
  const regions = {};
  data.forEach(s => {
    if (!regions[s.region]) regions[s.region] = { name: s.region, total: 0, delayed: 0, delivered: 0, inTransit: 0 };
    regions[s.region].total++;
    if (s.status === 'Delayed') regions[s.region].delayed++;
    if (s.status === 'Delivered') regions[s.region].delivered++;
    if (s.status === 'In Transit') regions[s.region].inTransit++;
  });
  return Object.values(regions);
}

// Live feed events
export function generateFeedEvent(shipment) {
  const events = [
    `📦 ${shipment.id} cleared customs at ${shipment.destination}`,
    `🚢 ${shipment.id} departed ${shipment.origin} via ${shipment.carrier}`,
    `⚠️ ${shipment.id} weather delay reported near route`,
    `✅ ${shipment.id} arrived at ${shipment.destination} dock`,
    `🔄 ${shipment.id} rerouted — ETA updated`,
    `📡 ${shipment.id} GPS ping received — ${Math.round(shipment.progress)}% complete`,
    `🏗️ ${shipment.id} container inspection cleared`,
    `⛽ ${shipment.id} refueling stop — ${shipment.carrier}`,
  ];
  return {
    id: Date.now() + Math.random(),
    message: events[Math.floor(Math.random() * events.length)],
    timestamp: new Date().toLocaleTimeString(),
    shipmentId: shipment.id,
    type: shipment.status === 'Delayed' ? 'warning' : shipment.status === 'Delivered' ? 'success' : 'info',
  };
}

// Timezone clocks
export const worldClocks = [
  { city: 'New York', tz: 'America/New_York', flag: '🇺🇸' },
  { city: 'London', tz: 'Europe/London', flag: '🇬🇧' },
  { city: 'Dubai', tz: 'Asia/Dubai', flag: '🇦🇪' },
  { city: 'Singapore', tz: 'Asia/Singapore', flag: '🇸🇬' },
  { city: 'Tokyo', tz: 'Asia/Tokyo', flag: '🇯🇵' },
  { city: 'Sydney', tz: 'Australia/Sydney', flag: '🇦🇺' },
];
