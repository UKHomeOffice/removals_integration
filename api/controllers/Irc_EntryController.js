/* global IrcEntryEventValidatorService DetaineeEvent */

'use strict';

var moment = require('moment');
var ModelHelpers = require('../lib/ModelHelpers');

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
      return this.saveEvent(request_body);
    }
    throw new ValidationError('Unknown');
  },

  saveEvent: request_body => {
    var event = {
      person_id: request_body.person_id,
      cid_id: request_body.cid_id,
      gender: request_body.gender === 'm' ? 'male' : 'female',
      nationality: request_body.nationality,
      centre: request_body.centre,
      operation: request_body.operation,
      timestamp: request_body.timestamp
    };
    var id = ModelHelpers.getPid.call(event);

    return DetaineeEvent.create(event).then(() =>
      DetaineeEvent.find({id: id}).then((detainees) =>
        detainees.map(existing => {
          if (moment(event.timestamp).isAfter(existing.lastTimestamp)) {
            return DetaineeEvent.update({id: id}, {
              cid_id: event.cid_id,
              gender: event.gender,
              nationality: event.nationality
            }).exec(() => {});
          }
        })
      )
    );
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
