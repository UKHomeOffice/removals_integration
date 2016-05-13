/* global Movement, Detainee, Event, Prebooking */
'use strict';

var ValidationError = require('../lib/exceptions/ValidationError');
var BedCountService = require('../services/BedCountService');
var LinkingModels = require('sails-linking-models');

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
      required: true
    },
    female_capacity: {
      type: 'integer',
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
    male_prebooking: {
      collection: 'prebooking',
      note: 'this is a workaround until waterline supports conditional joins see balderdashy/waterline#988 and balderdashy/waterline#645',
      via: 'male_prebooking'
    },
    female_prebooking: {
      collection: 'prebooking',
      note: 'this is a workaround until waterline supports conditional joins see balderdashy/waterline#988 and balderdashy/waterline#645',
      via: 'female_prebooking'
    },
    male_contingency: {
      collection: 'prebooking',
      note: 'this is a workaround until waterline supports conditional joins see balderdashy/waterline#988 and balderdashy/waterline#645',
      via: 'male_contingency'
    },
    female_contingency: {
      collection: 'prebooking',
      note: 'this is a workaround until waterline supports conditional joins see balderdashy/waterline#988 and balderdashy/waterline#645',
      via: 'female_contingency'
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
      const unreconciledEventCounter = (gender, operations) => this.unreconciledEvents.reduce((count, event) => {
        if (event.detainee.gender === gender && operations.indexOf(event.operation) >= 0) {
          return count + 1;
        }
        return count;
      }, 0);
      const unreconciledMovementCounter = (gender, direction) => this.unreconciledMovements.reduce((count, movement) => {
        if (movement.gender === gender && movement.direction === direction) {
          return count + 1;
        }
        return count;
      }, 0);

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
        response.attributes[gender + 'Capacity'] = this[gender + '_capacity'];
        response.attributes[gender + 'InUse'] = this[gender + '_in_use'];
        response.attributes[gender + 'OutOfCommission'] = this[gender + '_out_of_commission'];
        response.attributes[gender + 'Prebooking'] = this[gender + '_prebooking'].length;
        response.attributes[gender + 'Contingency'] = this[gender + '_contingency'].length;
        response.attributes[gender + 'Availability'] = response.attributes[gender + 'Capacity'];
        response.attributes[gender + 'Availability'] -= response.attributes[gender + 'InUse'];
        response.attributes[gender + 'Availability'] -= response.attributes[gender + 'OutOfCommission'];
        response.attributes[gender + 'Availability'] -= response.attributes[gender + 'Prebooking'];
        response.attributes[gender + 'Availability'] -= response.attributes[gender + 'Contingency'];
        if (this.reconciled) {
          response.attributes[gender + 'UnexpectedIn'] = unreconciledEventCounter(gender, ['check in']);
          response.attributes[gender + 'UnexpectedOut'] = unreconciledEventCounter(gender, ['check out']);
          response.attributes[gender + 'ScheduledIn'] = unreconciledMovementCounter(gender, 'in');
          response.attributes[gender + 'ScheduledOut'] = unreconciledMovementCounter(gender, 'out');
          response.attributes[gender + 'Availability'] -= response.attributes[gender + 'ScheduledIn'];
        }
      });
      return response;
    }
  },
  getGenderAndCentreByCIDLocation: function (location) {
    return this.find().then(centres =>
      _.compact(_.map(centres, centre => {
        if (_.contains(centre.male_cid_name, location)) {
          return {
            centre: centre.id,
            gender: 'male'
          };
        }
        if (_.contains(centre.female_cid_name, location)) {
          return {
            centre: centre.id,
            gender: 'female'
          };
        }
      }))[0]
    );
  },

  removeNonOccupancy: function () {
    return this.destroy({'mo-type': 'non-occupancy'});
  },

  afterCreate: function (record, done) {
    Centres.findOne({ id: record.id })
      .populate('male_prebooking')
      .populate('female_prebooking')
      .populate('male_contingency')
      .populate('female_contingency')
      .then(BedCountService.performConfiguredReconciliation)
      .then((centre) => {
        this.publishCreate(centre.toJSON());
        done();
      });
  },

  afterUpdate: function (record, done) {
    Centres.findOne({ id: record.id })
      .populate('male_prebooking')
      .populate('female_prebooking')
      .populate('male_contingency')
      .populate('female_contingency')
      .then(BedCountService.performConfiguredReconciliation)
      .then((centre) => {
        this.publishUpdate(centre.id, centre.toJSON(), null);
        done();
      });
  },

  afterDestroy: function (records, done) {
    Promise.all(_.map(records, (record) =>
        Movement.destroy({ centre: record.id })
          .then(() => Prebooking.destroy({ centre: record.id }))
          .then(() => Event.destroy({ centre: record.id }))
          .then(() => Detainee.destroy({ centre: record.id }))
          .then(() => this.publishDestroy(record.id, record))
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
  },

  publishCentreUpdates: collection =>
    Centres.find()
      .populate('male_prebooking')
      .populate('female_prebooking')
      .populate('male_contingency')
      .populate('female_contingency')
      .toPromise()
      .map(centre => Centres.publishUpdate(centre.id, centre.toJSON()))
      .then(() => collection)
};

module.exports = LinkingModels.mixin(model);
