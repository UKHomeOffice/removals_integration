"use strict";
const validation_schema = require('removals_schema').event;

module.exports = {
  validate: function (request_body) {
    return RequestValidatorService.validate(request_body, validation_schema);
  },
  schema: validation_schema
};
