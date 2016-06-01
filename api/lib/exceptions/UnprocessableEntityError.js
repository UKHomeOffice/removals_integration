'use strict';

var errorFactory = require('error-factory');

module.exports = errorFactory('UnprocessableEntityError', ['result']);
module.exports.prototype.statusCode = 422;
