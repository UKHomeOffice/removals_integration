/* global Movement, Detainee, Event, Prebooking, Heartbeat, Bed */
'use strict';

const ValidationError = require('../lib/exceptions/ValidationError');
const BedCountService = require('../services/BedCountService');
const LinkingModels = require('sails-linking-models');
const _ = require('lodash');

const unreconciledMovementReducer = (movements, gender, direction) => movements.reduce((reduced, m) => {
  if (m.gender === gender && m.direction === direction) {
    reduced.push({
      id: m.id,
      cid_id: m.cid_id,
      timestamp: m.timestamp
    });
  }
  return reduced;
}, []);
const unreconciledEventReducer = (events, gender, operations) => events.reduce((reduced, event) => {
  if (event.detainee.gender === gender && operations.indexOf(event.operation) >= 0) {
    reduced.push({id: event.id, cid_id: event.detainee.cid_id});
  }
  return reduced;
}, []);

const model = {
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    heartbeat_received: {
      type: 'datetime'
    },
    cid_received_date: {
      type: 'datetime'
    },
    prebooking_received: {
      type: 'datetime'
    },
    name: {
      type: 'string',
      defaultsTo: 0,
      required: true,
      unique: true
    },
    male_capacity: {
      type: 'integer',
      defaultsTo: 0,
      min: 0,
      required: true
    },
    female_capacity: {
      type: 'integer',
      min: 0,
      defaultsTo: 0,
      required: true
    },
    male_in_use: {
      type: 'integer',
      defaultsTo: 0,
      required: true
    },
    female_in_use: {
      type: 'integer',
      defaultsTo: 0,
      required: true
    },
    male_out_of_commission: {
      type: 'integer',
      defaultsTo: 0,
      required: true
    },
    female_out_of_commission: {
      type: 'integer',
      defaultsTo: 0,
      required: true
    },
    male_cid_name: {
      type: 'array'
    },
    female_cid_name: {
      type: 'array'
    },
    events: {
      collection: 'event',
      via: 'centre'
    },
    detainees: {
      collection: 'detainee',
      via: 'centre'
    },
    movements: {
      collection: 'movement',
      via: 'centre'
    },
    toJSON: function () {
      const response = {
        type: 'centre',
        id: this.id.toString(),
        attributes: {
          cidReceivedDate: this.cid_received_date ? this.cid_received_date.toString() : null,
          updated: this.updatedAt,
          heartbeatReceived: this.heartbeat_received ? this.heartbeat_received.toString() : null,
          prebookingReceived: this.prebooking_received ? this.prebooking_received.toString() : null,
          name: this.name
        },
        links: this.modelLinks('centres', reverseRouteService)
      };
      ['male', 'female'].forEach((gender) => {
        response.attributes[`${gender }Capacity`] = this[`${gender }_capacity`];
        response.attributes[`${gender }InUse`] = this[`${gender }_in_use`];
        response.attributes[`${gender }OutOfCommissionTotal`] = this[`${gender }_out_of_commission`];
        response.attributes[`${gender }OutOfCommissionDetail`] = this.outOfCommission ? this.outOfCommission[gender] : null;
        response.attributes[`${gender }PrebookingTotal`] = this.prebooking ? this.prebooking[gender].total : null;
        response.attributes[`${gender }PrebookingDetail`] = this.prebooking ? this.prebooking[gender].detail : null;
        response.attributes[`${gender }ContingencyTotal`] = this.contingency ? this.contingency[gender].total : null;
        response.attributes[`${gender }ContingencyDetail`] = this.contingency ? this.contingency[gender].detail : null;
        response.attributes[`${gender }Availability`] = response.attributes[`${gender }Capacity`];
        response.attributes[`${gender }Availability`] -= response.attributes[`${gender }InUse`];
        response.attributes[`${gender }Availability`] -= response.attributes[`${gender }OutOfCommissionTotal`];
        response.attributes[`${gender }Availability`] -= response.attributes[`${gender }ContingencyTotal`];
        response.attributes[`${gender }Availability`] -= response.attributes[`${gender }PrebookingTotal`];
        if (this.reconciled) {
          response.attributes[`${gender }UnexpectedIn`] = unreconciledEventReducer(this.unreconciledEvents, gender, ['check in']);
          response.attributes[`${gender }ExpectedIn`] = unreconciledMovementReducer(this.unreconciledMovements, gender, 'in');
          response.attributes[`${gender }ExpectedOut`] = unreconciledMovementReducer(this.unreconciledMovements, gender, 'out');
          response.attributes[`${gender }Availability`] -= response.attributes[`${gender }ExpectedIn`].length;
        }
      });
      return response;
    }
  },
  getGenderAndCentreByCIDLocation: function (location) {
    return this.find().then(centres =>
      _.compact(_.map(centres, centre => {
        centre.male_cid_name = _.map(centre.male_cid_name, string => string.toLowerCase());
        centre.female_cid_name = _.map(centre.female_cid_name, string => string.toLowerCase());
        if (_.includes(centre.male_cid_name, location.toLowerCase())) {
          return {
            centre: centre.id,
            gender: 'male'
          };
        }
        if (_.includes(centre.female_cid_name, location.toLowerCase())) {
          return {
            centre: centre.id,
            gender: 'female'
          };
        }
      }))[0]
    );
  },

  afterCreate: (centre, done) =>
    Centres.findReconciled({id: centre.id})
      .map((centre) => Centres.publishCreate(centre.toJSON()))
      .finally(() => done()),

  findReconciled: (query) =>
    Centres.find(query || {})
      .toPromise()
      .map(BedCountService.performConfiguredReconciliation),

  publishUpdateOne: (centre) =>
    Centres.findReconciled({id: centre.id || centre})
      .map((centre) => Centres.publishUpdate(centre.id, centre.toJSON())),

  publishUpdateAll: () =>
    Centres.findReconciled()
      .map((centre) => Centres.publishUpdate(centre.id, centre.toJSON())),

  afterDestroy: function (records, done) {
    Promise.all(_.map(records, (record) =>
      Movement.destroy({centre: record.id})
        .then(() => Prebooking.destroy({centre: record.id}))
        .then(() => Event.destroy({centre: record.id}))
        .then(() => Bed.destroy({centre: record.id}))
        .then(() => Detainee.destroy({centre: record.id}))
        .then(() => Heartbeat.destroy({centre: record.id}))
        .then(() => this.publishDestroy(record.id))
    ))
      .then(() => done());
  },

  getByName: function (name) {
    return this.findByName(name)
      .then((centre) => {
        if (centre === undefined || centre.length !== 1) {
          throw new ValidationError('Invalid centre');
        }
        return centre[0];
      });
  }

};

module.exports = LinkingModels.mixin(model);
