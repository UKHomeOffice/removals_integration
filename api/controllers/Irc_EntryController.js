/* global IrcEntryEventValidatorService Events Detainees */

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
      'heartbeat',
      'event'
    ]
  },

  heartbeatOptions: (req, res) =>
    res.ok(IrcEntryHeartbeatValidatorService.schema),
  eventOptions: (req, res) =>
    res.ok(IrcEntryEventValidatorService.schema),

  index: (req, res) => res.ok,

  process_heartbeat: (request_body) =>
    Centres.update(
      {
        name: request_body.centre
      }, {
        heartbeat_recieved: new Date(),
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
      })
      .each(centre => {
        Centres.publishUpdate(centre.id, centre.toJSON());
        return centre;
      }),

  heartbeatPost: function (req, res) {
    return IrcEntryHeartbeatValidatorService.validate(req.body)
      .then(this.process_heartbeat)
      .then(res.ok)
      .catch(ValidationError, (error) => {
        res.badRequest(error.message);
      })
      .catch((error) => {
        res.serverError(error.message);
      });
  },

  process_event: function (request_body) {
    if (request_body.operation === 'check in') {
      return this.saveDetainee(request_body)
        .then(this.saveEvent.bind(this, request_body));
    }
    throw new ValidationError('Unknown');
  },

  getPID: function (entity) {
    return `${entity.centre}_${entity.person_id}`;
  },

  saveEvent: function (request_body, detainee) {
    return Events.create({
      operation: request_body.operation,
      timestamp: request_body.timestamp,
      detainee: detainee
    });
  },

  saveDetainee: function (request_body) {
    var person_id = this.getPID(request_body);
    return Detainees.findOrCreate({
      id: person_id
    }, {
      id: person_id,
      cid_id: request_body.cid_id,
      gender: request_body.gender,
      centre: request_body.centre
    });
  },

  eventPost: function (req, res) {
    return IrcEntryEventValidatorService.validate(req.body)
      .then(this.process_event)
      .then(res.ok)
      .catch(ValidationError, (error) => {
        res.badRequest(error.message);
      })
      .catch((error) => {
        res.serverError(error.message);
      });
  }
};
