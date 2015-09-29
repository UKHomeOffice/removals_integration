// EmailService.js - in api/services
var Promise = require('bluebird');
var validate = require('jsonschema').validate;

module.exports = {

  validate: function (request_body, validation_schema) {
    return new Promise(function (resolve, reject) {

      var validation_response = validate(request_body, validation_schema);

      if (validation_response.errors.length > 0) {
        return reject(validation_response.errors);
      }
      resolve(request_body);
    });
  }
};
