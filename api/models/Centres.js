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
    male_active_movements_in: {
      collection: 'movement',
      note: 'this is a workaround until waterline supports conditional joins see balderdashy/waterline#988 and balderdashy/waterline#645',
      via: 'active_male_centre_in'
    },
    male_active_movements_out: {
      collection: 'movement',
      note: 'this is a workaround until waterline supports conditional joins see balderdashy/waterline#988 and balderdashy/waterline#645',
      via: 'active_male_centre_out'
    },
    female_active_movements_in: {
      collection: 'movement',
      note: 'this is a workaround until waterline supports conditional joins see balderdashy/waterline#988 and balderdashy/waterline#645',
      via: 'active_female_centre_in'
    },
    female_active_movements_out: {
      collection: 'movement',
      note: 'this is a workaround until waterline supports conditional joins see balderdashy/waterline#988 and balderdashy/waterline#645',
      via: 'active_female_centre_out'
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
          name: this.name,
          maleCapacity: this.male_capacity,
          femaleCapacity: this.female_capacity,
          maleInUse: this.male_in_use,
          femaleInUse: this.female_in_use,
          maleOutOfCommission: this.male_out_of_commission,
          femaleOutOfCommission: this.female_out_of_commission,
          maleAvailability: this.male_capacity - this.male_out_of_commission - this.male_in_use - this.male_prebooking.length - this.male_contingency.length,
          femaleAvailability: this.female_capacity - this.female_out_of_commission - this.female_in_use - this.female_prebooking.length - this.female_contingency.length,
          malePrebooking: this.male_prebooking.length,
          femalePrebooking: this.female_prebooking.length,
          maleContingency: this.male_contingency.length,
          femaleContingency: this.female_contingency.length,
          maleActiveMovementsIn: this.male_active_movements_in.length,
          maleActiveMovementsOut: this.male_active_movements_out.length,
          femaleActiveMovementsIn: this.female_active_movements_in.length,
          femaleActiveMovementsOut: this.female_active_movements_out.length
        },
        links: this.modelLinks('centres', reverseRouteService)
      };
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

  afterCreate: function (record, done) {
    this.publishCreate(record);
    done();
  },

  afterUpdate: function (record, done) {
    this.publishUpdate(record.id, record);
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
      .populate('male_active_movements_in')
      .populate('male_active_movements_out')
      .populate('female_active_movements_in')
      .populate('female_active_movements_out')
      .toPromise()
      .map(centre => Centres.publishUpdate(centre.id, centre.toJSON()))
      .then(() => collection)
};

module.exports = LinkingModels.mixin(model);
