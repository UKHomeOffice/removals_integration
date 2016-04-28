'use strict';

var ValidationError = require('../lib/exceptions/ValidationError');
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
    mo_type: {
      type: 'string',
      required: true,
      defaultsTo: 0
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
        response.attributes[gender + 'Availability'] = this[gender + '_capacity'] - this[gender + '_in_use'] - this[gender + '_out_of_commission'];
        response.attributes[gender + 'Prebooking'] = this[gender + '_prebooking'].length;
        response.attributes[gender + 'Contingency'] = this[gender + '_contingency'].length;
        if (this.reconciled) {
          response.attributes[gender + 'UnexpectedIn'] = unreconciledEventCounter(gender, ['check in']);
          response.attributes[gender + 'UnexpectedOut'] = unreconciledEventCounter(gender, ['check out']);
          response.attributes[gender + 'ScheduledIn'] = unreconciledMovementCounter(gender, 'in');
          response.attributes[gender + 'ScheduledOut'] = unreconciledMovementCounter(gender, 'out');
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
    return this.destroy({ 'mo-type': 'non-occupancy' });
  },

  afterCreate: function (record, done) {
    this.publishCreate(record);
    done();
  },

  afterUpdate: function (record, done) {
    this.publishUpdate(record.id, record, null);
    done();
  },

  afterDestroy: function (records, done) {
    _.map(records, (record) => this.publishDestroy(record.id, record));
    done();
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
