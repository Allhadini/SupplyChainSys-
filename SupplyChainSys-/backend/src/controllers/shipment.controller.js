const shipmentService = require('../services/shipment.service');
const aiService = require('../services/ai.service');
const optimizationService = require('../services/optimization.service');
const alertService = require('../services/alert.service');
const { RISK_THRESHOLD, ALERT_TYPE, SHIPMENT_STATUS } = require('../utils/constants');
const logger = require('../utils/logger');
const axios = require('axios');

/**
 * POST /api/shipments/create
 * Create a new shipment.
 */
const createShipment = async (req, res) => {
  const { origin, destination, currentLocation, route } = req.body;

  if (!origin || !destination || !currentLocation) {
    return res.status(400).json({
      success: false,
      error: 'origin, destination, and currentLocation are required.',
    });
  }

  const shipment = await shipmentService.createShipment({
    origin,
    destination,
    currentLocation,
    route,
  });

  res.status(201).json({ success: true, data: shipment });
};

/**
 * GET /api/shipments
 * List all shipments.
 */
const getAllShipments = async (req, res) => {
  const shipments = await shipmentService.getAllShipments();
  res.status(200).json({ success: true, count: shipments.length, data: shipments });
};

/**
 * GET /api/shipments/:id
 *
 * ✦ INTELLIGENT WORKFLOW (most important feature):
 *   1. Fetch shipment from MongoDB
 *   2. Call AI service → riskScore
 *   3. Update shipment with new riskScore
 *   4. IF riskScore > threshold:
 *        → Call optimization service
 *        → Save optimized route
 *        → Trigger alert
 *   5. Return enriched response
 */
const getShipmentById = async (req, res) => {
  const { id } = req.params;

  // 1. Fetch shipment
  let shipment = await shipmentService.getShipmentById(id);
  logger.info(`[Workflow] Fetched shipment ${id}`);

  // 2. AI risk evaluation
  const riskResult = await aiService.computeRiskScore({
    location: shipment.currentLocation,
    route: shipment.route,
  });
  logger.info(`[Workflow] Risk score: ${riskResult.riskScore} — ${riskResult.reason}`);

  // 3. Update shipment with risk data
  shipment = await shipmentService.updateShipment(id, {
    riskScore: riskResult.riskScore,
    riskReason: riskResult.reason,
  });

  let optimization = null;
  let alerts = [];

  // 4. If risk exceeds threshold, trigger optimization + alert
  if (riskResult.riskScore > RISK_THRESHOLD) {
    logger.info(`[Workflow] Risk ${riskResult.riskScore} > ${RISK_THRESHOLD} — triggering optimization`);

    // 4a. Optimize route
    optimization = await optimizationService.optimizeRoute({
      origin: shipment.origin,
      destination: shipment.destination,
      currentRoute: shipment.route,
      currentLocation: shipment.currentLocation,
    });

    // 4b. Save optimized route
    shipment = await shipmentService.updateShipment(id, {
      optimizedRoute: optimization.newRoute,
      optimizationMeta: {
        cost: optimization.cost,
        delaySaved: optimization.delaySaved,
        optimizedAt: new Date(),
      },
      status: SHIPMENT_STATUS.RE_ROUTED,
    });

    // 4c. Trigger alert
    const alert = await alertService.createAlert({
      shipmentId: id,
      type: ALERT_TYPE.RISK_THRESHOLD,
      severity: alertService.severityFromRisk(riskResult.riskScore),
      message: `Risk score ${riskResult.riskScore} — ${riskResult.reason}. Route re-optimized.`,
      riskScore: riskResult.riskScore,
      metadata: { optimization },
    });

    alerts = [alert];
    logger.info(`[Workflow] Alert created: ${alert._id}`);
  }

  // 5. Return enriched response
  res.status(200).json({
    success: true,
    data: {
      shipment,
      riskScore: riskResult.riskScore,
      riskReason: riskResult.reason,
      optimization,
      alerts,
    },
  });
};

/**
 * POST /api/shipments/import-live
 * Import 20 live ships from digitraffic.fi into our database.
 */
const importLiveShipments = async (req, res) => {
  try {
    const shipDataRes = await axios.get('https://meri.digitraffic.fi/api/v1/locations/latest');
    const liveShips = shipDataRes.data.features.slice(0, 20);
    
    const createdShipments = [];
    for (let i = 0; i < liveShips.length; i++) {
        const ship = liveShips[i];
        const shipment = await shipmentService.createShipment({
            origin: 'Baltic Origin',
            destination: `Baltic Destination ${i+1}`,
            currentLocation: { lat: ship.geometry.coordinates[1], long: ship.geometry.coordinates[0] },
            status: ship.properties.sog > 0 ? SHIPMENT_STATUS.IN_TRANSIT : SHIPMENT_STATUS.DELAYED
        });
        createdShipments.push(shipment);
    }
    logger.info(`Imported ${createdShipments.length} live shipments to DB`);
    res.status(200).json({ success: true, count: createdShipments.length, data: createdShipments });
  } catch (err) {
    logger.error('Import failed', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  createShipment,
  getAllShipments,
  getShipmentById,
  importLiveShipments,
};
