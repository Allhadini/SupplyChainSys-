const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { authMiddleware } = require('../middleware/auth.middleware');
const shipmentController = require('../controllers/shipment.controller');

/**
 * Shipment Routes
 *
 * POST   /api/shipments/create       — Create a new shipment
 * POST   /api/shipments/import-live  — Import live maritime data
 * GET    /api/shipments              — List all shipments
 * GET    /api/shipments/:id          — Get enriched shipment (intelligent workflow)
 */

router.post('/create', authMiddleware, asyncHandler(shipmentController.createShipment));
router.post('/import-live', authMiddleware, asyncHandler(shipmentController.importLiveShipments));
router.get('/', authMiddleware, asyncHandler(shipmentController.getAllShipments));
router.get('/:id', authMiddleware, asyncHandler(shipmentController.getShipmentById));

module.exports = router;
