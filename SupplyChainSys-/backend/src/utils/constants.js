/**
 * Application-wide constants.
 * Centralised here so magic numbers & strings never leak into service code.
 */

module.exports = {
  // ── Shipment statuses ────────────────────────────────────
  SHIPMENT_STATUS: {
    PENDING: 'pending',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
    DELAYED: 'delayed',
    CANCELLED: 'cancelled',
    RE_ROUTED: 're_routed',
  },

  // ── Alert severities ────────────────────────────────────
  ALERT_SEVERITY: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical',
  },

  // ── Alert types ──────────────────────────────────────────
  ALERT_TYPE: {
    RISK_THRESHOLD: 'risk_threshold',
    ROUTE_CHANGE: 'route_change',
    DELIVERY_DELAY: 'delivery_delay',
    WEATHER: 'weather',
    CONGESTION: 'congestion',
  },

  // ── Risk thresholds ──────────────────────────────────────
  RISK_THRESHOLD: parseFloat(process.env.RISK_THRESHOLD) || 0.7,

  // ── Redis cache TTLs (seconds) ───────────────────────────
  CACHE_TTL: {
    SHIPMENT: 300,        // 5 min
    RISK_SCORE: 180,      // 3 min
    ALERT_LIST: 120,      // 2 min
  },

  // ── Kafka topics (mirrored from config/kafka.js) ─────────
  KAFKA_TOPICS: {
    SHIPMENT_UPDATES: 'shipment-updates',
    RISK_EVALUATIONS: 'risk-evaluations',
    ALERTS: 'alerts',
  },
};
