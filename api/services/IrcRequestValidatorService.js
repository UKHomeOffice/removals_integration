var validation_schema = require('./request_schemas/irc.json');

module.exports = {
  validate: function (request_body) {
    return RequestValidatorService.validate(request_body, validation_schema);
  }
};
