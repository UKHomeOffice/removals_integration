/**
 * Production environment settings
 */

module.exports = {
  models: {
    connection: 'environmentLedMysqlServer'
  },
  port: 8000,
  sockets: {
    adapter: 'redis',
    host: process.env.REDIS_SENTINEL_SERVICE_HOST,
    port: process.env.REDIS_SENTINEL_SERVICE_PORT
  }
};
