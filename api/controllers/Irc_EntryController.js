'use strict';

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

  heartbeatOptions: (req, res) =>
    res.ok(IrcEntryHeartbeatValidatorService.schema),

  index: (req, res) => res.ok,

  process_heartbeat: (request_body) =>
    Centres.update(
      {
        name: request_body.centre
      }, {
        heartbeat_received: new Date(),
        male_in_use: request_body.male_occupied,
        female_in_use: request_body.female_occupied,
        male_out_of_commission: request_body.male_outofcommission,
        female_out_of_commission: request_body.female_outofcommission
      })
      .then(centres => {
        if (centres.length !== 1) {
          throw new ValidationError("Invalid centre");
        }
        return centres;
      }),

  publishCentreUpdates: centres =>
    Centres.find()
      .populate('male_active_movements_in')
      .populate('male_active_movements_out')
      .populate('female_active_movements_in')
      .populate('female_active_movements_out')
      .then(centres => _.map(centres, centre => Centres.publishUpdate(centre.id, centre.toJSON())))
      .then(() => centres),

  heartbeatPost: function (req, res) {
    return IrcEntryHeartbeatValidatorService.validate(req.body)
      .then(this.process_heartbeat)
      .then(this.publishCentreUpdates)
      .then(res.ok)
      .catch(ValidationError, (error) => {
        res.badRequest(error.message);
      })
      .catch((error) => {
        res.serverError(error.message);
      });
  }
};
