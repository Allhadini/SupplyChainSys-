const alertService = require('../services/alert.service');
const logger = require('../utils/logger');

/**
 * POST /api/alerts
 * Manually create an alert (e.g. from an external system or dashboard).
 */
const createAlert = async (req, res) => {
  const { shipmentId, type, severity, message, riskScore, metadata } = req.body;

  if (!shipmentId || !message) {
    return res.status(400).json({
      success: false,
      error: 'shipmentId and message are required.',
    });
  }

  logger.info(`[Alert Controller] Creating alert for shipment ${shipmentId}`);

  const alert = await alertService.createAlert({
    shipmentId,
    type,
    severity,
    message,
    riskScore,
    metadata,
  });

  res.status(201).json({ success: true, data: alert });
};

/**
 * GET /api/alerts
 * List all alerts with optional filters (?shipmentId=, ?severity=, ?resolved=).
 */
const getAllAlerts = async (req, res) => {
  const filters = {};
  if (req.query.shipmentId) filters.shipmentId = req.query.shipmentId;
  if (req.query.severity) filters.severity = req.query.severity;
  if (req.query.resolved !== undefined) filters.resolved = req.query.resolved === 'true';

  const alerts = await alertService.getAllAlerts(filters);

  res.status(200).json({ success: true, count: alerts.length, data: alerts });
};

module.exports = { createAlert, getAllAlerts };
