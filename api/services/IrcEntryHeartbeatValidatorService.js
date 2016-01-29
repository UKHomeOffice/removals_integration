'use strict';

const schema = require('removals_schema').heartbeat;

module.exports = {
  validate: function (request_body) {
    return RequestValidatorService.validate(request_body, schema);
  },
  schema: schema
};
