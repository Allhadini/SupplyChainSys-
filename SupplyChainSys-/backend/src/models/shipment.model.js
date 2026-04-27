const mongoose = require('mongoose');
const { SHIPMENT_STATUS } = require('../utils/constants');

const locationSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
  },
  { _id: false },
);

const routeNodeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lat: { type: Number },
    long: { type: Number },
    estimatedArrival: { type: Date },
  },
  { _id: false },
);

const shipmentSchema = new mongoose.Schema(
  {
    origin: {
      type: String,
      required: [true, 'Origin is required'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    currentLocation: {
      type: locationSchema,
      required: [true, 'Current location is required'],
    },
    route: {
      type: [routeNodeSchema],
      default: [],
    },
    status: {
      type: String,
      enum: Object.values(SHIPMENT_STATUS),
      default: SHIPMENT_STATUS.PENDING,
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
    riskReason: {
      type: String,
      default: '',
    },
    optimizedRoute: {
      type: [routeNodeSchema],
      default: [],
    },
    optimizationMeta: {
      cost: { type: Number },
      delaySaved: { type: String },
      optimizedAt: { type: Date },
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ── Indexes ───────────────────────────────────────────────
shipmentSchema.index({ status: 1 });
shipmentSchema.index({ riskScore: -1 });
shipmentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Shipment', shipmentSchema);
