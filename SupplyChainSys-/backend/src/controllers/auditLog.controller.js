const AuditLog = require('../models/auditLog.model');
const logger = require('../utils/logger');

const getLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100).populate('user', 'name email');
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    logger.error(`Error fetching audit logs: ${error.message}`);
    res.status(500).json({ success: false, error: 'Failed to fetch audit logs' });
  }
};

const createLog = async (req, res) => {
  try {
    const log = await AuditLog.create(req.body);
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    logger.error(`Error creating audit log: ${error.message}`);
    res.status(500).json({ success: false, error: 'Failed to create audit log' });
  }
};

module.exports = { getLogs, createLog };
