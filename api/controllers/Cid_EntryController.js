var ValidationError = require('../lib/exceptions/ValidationError');

var movementSchema = {};

module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: false,
    exposedMethods: [
      'movement'
    ]
  },

  movementOptions: (req, res) => res.ok(CidEntryMovementValidatorService.schema),

  movement_process: request_body => request_body,

  movementPost: function (req, res) {
    return CidEntryMovementValidatorService.validate(req.body)
      .then(this.movement_process)
      .then(res.ok)
      .catch(ValidationError, (error) => {
        res.badRequest(error.message);
      })
      .catch((error) => {
        res.serverError(error.message);
      });
  },

};
