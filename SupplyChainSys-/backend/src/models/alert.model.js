const mongoose = require('mongoose');
const { ALERT_SEVERITY, ALERT_TYPE } = require('../utils/constants');

const alertSchema = new mongoose.Schema(
  {
    shipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shipment',
      required: [true, 'Shipment reference is required'],
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(ALERT_TYPE),
      required: [true, 'Alert type is required'],
    },
    severity: {
      type: String,
      enum: Object.values(ALERT_SEVERITY),
      default: ALERT_SEVERITY.MEDIUM,
    },
    message: {
      type: String,
      required: [true, 'Alert message is required'],
      trim: true,
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 1,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    resolvedAt: {
      type: Date,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ── Indexes ───────────────────────────────────────────────
alertSchema.index({ resolved: 1, createdAt: -1 });
alertSchema.index({ severity: 1 });

module.exports = mongoose.model('Alert', alertSchema);
