const { consumer } = require('../config/kafka');
const { produceMessage, TOPICS } = require('../config/kafka');
const { computeRiskScore } = require('./ai.service');
const { updateShipment } = require('./shipment.service');
const { createAlert, severityFromRisk } = require('./alert.service');
const logger = require('../utils/logger');
const { RISK_THRESHOLD, ALERT_TYPE, SHIPMENT_STATUS } = require('../utils/constants');

/**
 * Simulated Kafka streaming pipeline.
 *
 * Consumer loop:
 *   SHIPMENT_UPDATES → re-evaluate risk → trigger alerts if needed
 *
 * This acts as the "event-driven glue" between microservices.
 */
const startStreamConsumer = async () => {
  try {
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const payload = JSON.parse(message.value.toString());
        logger.info(`Stream [${topic}] partition:${partition} → ${payload.event}`);

        switch (payload.event) {
          case 'SHIPMENT_CREATED':
          case 'SHIPMENT_LOCATION_UPDATED':
            await handleShipmentEvent(payload);
            break;

          default:
            logger.debug(`Unhandled stream event: ${payload.event}`);
        }
      },
    });

    logger.info('Kafka stream consumer is running');
  } catch (error) {
    logger.warn(`Stream consumer could not start (simulated mode): ${error.message}`);
  }
};

/**
 * Process a shipment event:
 *   1. Re-compute risk score via AI
 *   2. Update the shipment document
 *   3. Trigger alert if above threshold
 */
const handleShipmentEvent = async (payload) => {
  const { shipmentId } = payload;
  if (!shipmentId) return;

  try {
    const Shipment = require('../models/shipment.model');
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) {
      logger.warn(`Stream: shipment ${shipmentId} not found`);
      return;
    }

    // 1. AI risk evaluation
    const riskResult = await computeRiskScore({
      location: shipment.currentLocation,
      route: shipment.route,
    });

    // 2. Update shipment
    await updateShipment(shipmentId, {
      riskScore: riskResult.riskScore,
      riskReason: riskResult.reason,
    });

    // 3. Alert if above threshold
    if (riskResult.riskScore > RISK_THRESHOLD) {
      await createAlert({
        shipmentId,
        type: ALERT_TYPE.RISK_THRESHOLD,
        severity: severityFromRisk(riskResult.riskScore),
        message: `Risk score ${riskResult.riskScore} exceeds threshold — ${riskResult.reason}`,
        riskScore: riskResult.riskScore,
      });
    }

    logger.info(`Stream: shipment ${shipmentId} re-evaluated — risk: ${riskResult.riskScore}`);
  } catch (error) {
    logger.error(`Stream handler error for ${shipmentId}: ${error.message}`);
  }
};

/**
 * Simulate a shipment location update event being produced to Kafka.
 * Useful for testing the full pipeline without a real Kafka broker.
 */
const simulateShipmentUpdate = async (shipmentId, newLocation) => {
  logger.info(`Simulating location update for shipment ${shipmentId}`);

  // Update location in DB first
  const Shipment = require('../models/shipment.model');
  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) {
    throw new Error(`Shipment ${shipmentId} not found`);
  }

  shipment.currentLocation = newLocation;
  shipment.status = SHIPMENT_STATUS.IN_TRANSIT;
  await shipment.save();

  // Produce Kafka event (or handle inline if Kafka is down)
  try {
    await produceMessage(TOPICS.SHIPMENT_UPDATES, {
      event: 'SHIPMENT_LOCATION_UPDATED',
      shipmentId,
      newLocation,
      timestamp: new Date().toISOString(),
    });
  } catch {
    // If Kafka is unavailable, process inline (simulated)
    logger.info('Kafka unavailable — processing event inline');
    await handleShipmentEvent({
      event: 'SHIPMENT_LOCATION_UPDATED',
      shipmentId,
    });
  }

  return shipment;
};

module.exports = {
  startStreamConsumer,
  simulateShipmentUpdate,
};
