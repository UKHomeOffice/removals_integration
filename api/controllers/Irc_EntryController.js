/**
 * IrcPostController
 *
 * @description :: Server-side logic for managing ircposts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var ValidationError = require('../lib/exceptions/ValidationError');

module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: false,
    exposedMethods: [
      'heartbeat'
    ]
  },

  heartbeatOptions: (req, res) => res.ok(IrcEntryHeartbeatValidatorService.schema),

  index: (req, res) => res.ok,

  process_heartbeat: (request_body) =>
    Centre.getByName(request_body.centre)
      .then((centre) => {
        centre.male_in_use = request_body.male_occupied;
        centre.female_in_use = request_body.female_occupied;
        centre.male_out_of_commission = request_body.male_outofcommission;
        centre.female_out_of_commission = request_body.female_outofcommission;
        return centre.save();
      })
      .tap((centre) => Centre.publishUpdate(centre.id, centre.toJSON())),

  heartbeatPost: (req, res) =>
    promise = IrcEntryHeartbeatValidatorService.validate(req.body)
      .catch(ValidationError, (error) => {
        res.badRequest(error.message);
        return promise.cancel();
      })
      .catch((error) => {
        res.serverError(error.message);
        return promise.cancel();
      })
      .then(this.process_heartbeat)
      .then(res.ok)

};
