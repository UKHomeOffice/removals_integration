var Promise = require('bluebird');
var tv4 = require('tv4');

var ValidationError = require('../lib/exceptions/ValidationError');

module.exports = {
  validate: function (request_body, validation_schema) {
    return new Promise(function (resolve) {
      var result = tv4.validateMultiple(request_body, validation_schema);
      if (result.valid !== true) {
        throw new ValidationError(result);
      }
      return resolve(request_body);
    });
  }
}
