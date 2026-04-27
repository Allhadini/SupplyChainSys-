const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { authMiddleware } = require('../middleware/auth.middleware');
const auditLogController = require('../controllers/auditLog.controller');

router.get('/', asyncHandler(auditLogController.getLogs));
router.post('/', asyncHandler(auditLogController.createLog));

module.exports = router;
