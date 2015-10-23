/**
 * Production dropping environment settings
 */
module.exports = require('./production');
module.exports.models.migrate = 'drop';
