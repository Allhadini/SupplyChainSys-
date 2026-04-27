const axios = require('axios');
const logger = require('../utils/logger');

const OPTIMIZATION_SERVICE_URL =
  process.env.OPTIMIZATION_SERVICE_URL || 'http://localhost:9000';

/**
 * Call the external Python optimization service to compute a better route.
 *
 * Falls back to a mock optimizer when the service is unreachable.
 *
 * @param {Object} params
 * @param {string} params.origin
 * @param {string} params.destination
 * @param {Array}  params.currentRoute
 * @param {Object} params.currentLocation
 * @returns {{ newRoute: Array, cost: number, delaySaved: string }}
 */
const optimizeRoute = async ({ origin, destination, currentRoute, currentLocation }) => {
  let result;

  try {
    logger.info(`Calling Optimization service: ${OPTIMIZATION_SERVICE_URL}/api/optimize`);
    const response = await axios.post(
      `${OPTIMIZATION_SERVICE_URL}/api/optimize`,
      { origin, destination, currentRoute, currentLocation },
      { timeout: 8000 },
    );
    result = response.data;
    logger.info(`Optimization service responded — cost: ${result.cost}`);
  } catch (error) {
    logger.warn(`Optimization service unreachable, using mock optimizer: ${error.message}`);
    result = generateMockOptimization(origin, destination, currentRoute);
  }

  return result;
};

/**
 * Mock optimizer for local development.
 * Generates a plausible re-route with cost savings.
 */
const generateMockOptimization = (origin, destination, currentRoute = []) => {
  // Generate intermediate waypoints
  const hubs = [
    'Singapore Hub',
    'Rotterdam Port',
    'Shanghai Terminal',
    'Dubai Logistics Center',
    'Hamburg Gateway',
    'Los Angeles Port',
    'Colombo Transshipment',
    'Jebel Ali Free Zone',
  ];

  // Pick 2-3 hubs that aren't origin/destination
  const available = hubs.filter(
    (h) => !h.toLowerCase().includes(origin.toLowerCase()) &&
           !h.toLowerCase().includes(destination.toLowerCase()),
  );

  const numStops = Math.min(2 + Math.floor(Math.random() * 2), available.length);
  const selectedHubs = available.sort(() => 0.5 - Math.random()).slice(0, numStops);

  const newRoute = [
    { name: origin, lat: 0, long: 0 },
    ...selectedHubs.map((name) => ({
      name,
      lat: parseFloat((Math.random() * 60 - 30).toFixed(4)),
      long: parseFloat((Math.random() * 120 - 60).toFixed(4)),
    })),
    { name: destination, lat: 0, long: 0 },
  ];

  const cost = Math.floor(800 + Math.random() * 1200);
  const hoursOptions = [2, 4, 6, 8, 12];
  const delaySaved = `${hoursOptions[Math.floor(Math.random() * hoursOptions.length)]} hours`;

  return { newRoute, cost, delaySaved };
};

module.exports = { optimizeRoute };
