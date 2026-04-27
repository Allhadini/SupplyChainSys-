const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { authMiddleware } = require('../middleware/auth.middleware');
const alertController = require('../controllers/alert.controller');

/**
 * Alert Routes
 *
 * POST /api/alerts — Create an alert manually
 * GET  /api/alerts — List all alerts (supports ?shipmentId=, ?severity=, ?resolved=)
 */

router.post('/', authMiddleware, asyncHandler(alertController.createAlert));
router.get('/', authMiddleware, asyncHandler(alertController.getAllAlerts));

module.exports = router;
