/* global IrcEntryEventValidatorService Event Detainee */

'use strict';

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
    switch (request_body.operation) {
    case Event.OPERATION_CHECK_IN:
    case Event.OPERATION_CHECK_OUT:
    case Event.OPERATION_INTER_SITE_TRANSFER:
    case Event.OPERATION_REINSTATEMENT:
      return this.saveEvent(request_body);
    default:
      throw new ValidationError('Invalid operation');
    }
  },

  createOrUpdateDetainee: function (request_body) {
    return Centres.findOne({ name: request_body.centre })
      .populate('detainees', { person_id: request_body.person_id })
      .then(function (centre) {
        if (!centre) {
          throw new Error('Centre could not be found');
        }
        if (centre.detainees.length === 1) {
          var detainee = centre.detainees[0];
          if (!detainee) {
            throw new Error('Detainee could not be found');
          }
          if (detainee.timestamp.toISOString() < request_body.timestamp) {
            detainee.timestamp = request_body.timestamp;

            if (request_body.gender) {
              detainee.gender = Detainee.normalizeGender(request_body.gender);
            }
            if (request_body.nationality) {
              detainee.nationality = request_body.nationality;
            }
            if (request_body.cid_id) {
              detainee.cid_id = request_body.cid_id;
            }
          }
          return detainee.save();
        }
        return Detainee.create({
          centre: centre,
          person_id: request_body.person_id,
          timestamp: request_body.timestamp,
          nationality: request_body.nationality,
          gender: request_body.gender === "m" ? 'male' : 'female',
          cid_id: request_body.cid_id
        });
      });
  },
  saveEvent: function (request_body) {
    return this.createOrUpdateDetainee(request_body)
      .then(() => this.buildEventObject(request_body))
      .then((event) => Event.create(event));
  },

  buildEventObject: function (request_body) {
    return Centres.findOne({ name: request_body.centre })
      .populate('detainees', { person_id: request_body.person_id })
      .then(function (centre) {
        if (!centre) {
          throw new Error('Centre could not be found');
        }
        return {
          centre: centre,
          detainee: centre.detainees[0],
          operation: request_body.operation,
          timestamp: request_body.timestamp
        };
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
