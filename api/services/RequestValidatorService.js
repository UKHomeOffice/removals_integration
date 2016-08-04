'use strict';

const Promise = require('bluebird');
const tv4 = require('tv4');
const ValidationError = require('../lib/exceptions/ValidationError');

module.exports = {
  validate: function (request_body, schema) {
    return new Promise(function (resolve) {
      var result = tv4.validateMultiple(request_body, schema);
      if (result.valid !== true) {
        throw new ValidationError(result);
      }
      return resolve(request_body);
    });
  }
};
