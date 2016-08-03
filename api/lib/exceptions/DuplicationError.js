'use strict';

const errorFactory = require('error-factory');

module.exports = errorFactory('DuplicationError');
module.exports.prototype.statusCode = 208;
