var Promise = require('bluebird');
var validate = require('jsonschema').validate;

var ValidationError = require('../lib/exceptions/ValidationError');

module.exports = {
  validate: function (request_body, validation_schema) {
    return new Promise(function (resolve) {

      var validation_response = validate(request_body, validation_schema);

      if (validation_response.errors.length > 0) {
        throw new ValidationError(validation_response.errors);
      }
      return resolve(request_body);
    });
  }
}
