const { Kafka, logLevel } = require('kafkajs');
const logger = require('../utils/logger');

/**
 * Kafka configuration.
 *
 * In development / local environments Kafka may not be running.
 * We gracefully handle connection failures so the rest of the
 * platform keeps working.
 */

const kafka = new Kafka({
  clientId: 'atlas-logix',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  logLevel: logLevel.WARN,
  retry: {
    initialRetryTime: 300,
    retries: 5,
  },
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'atlas-logix-group' });

const TOPICS = {
  SHIPMENT_UPDATES: 'shipment-updates',
  RISK_EVALUATIONS: 'risk-evaluations',
  ALERTS: 'alerts',
};

/**
 * Connect Kafka producer.
 */
const connectProducer = async () => {
  try {
    await producer.connect();
    logger.info('Kafka producer connected');
  } catch (error) {
    logger.warn(`Kafka producer unavailable (simulated mode): ${error.message}`);
  }
};

/**
 * Connect Kafka consumer and subscribe to relevant topics.
 */
const connectConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topics: Object.values(TOPICS), fromBeginning: false });
    logger.info('Kafka consumer connected & subscribed');
  } catch (error) {
    logger.warn(`Kafka consumer unavailable (simulated mode): ${error.message}`);
  }
};

/**
 * Produce a message to a topic.
 */
const produceMessage = async (topic, message) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message), timestamp: Date.now().toString() }],
    });
    logger.info(`Kafka → [${topic}] message produced`);
  } catch (error) {
    logger.warn(`Kafka produce failed (simulated mode): ${error.message}`);
  }
};

module.exports = {
  kafka,
  producer,
  consumer,
  TOPICS,
  connectProducer,
  connectConsumer,
  produceMessage,
};
