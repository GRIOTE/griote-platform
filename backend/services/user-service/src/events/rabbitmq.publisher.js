const amqp = require('amqplib');
const logger = require('../config/logger');

let channel = null;

async function connect() {
  if (channel) return channel;
  const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  channel = await conn.createChannel();
  return channel;
}

async function publishUserCreated({ event, data }) {
  const ch = await connect();
  const exchange = 'user.events';
  await ch.assertExchange(exchange, 'fanout', { durable: false });
  ch.publish(exchange, '', Buffer.from(JSON.stringify({ event, data })));
  logger.info('UserCreated event published', { event, data });
}

module.exports = { connect, publishUserCreated };