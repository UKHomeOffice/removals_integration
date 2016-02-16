/* global Detainee */
"use strict";

var LinkingModels = require('sails-linking-models');
var ModelHelpers = require('../lib/ModelHelpers');

var setNormalisedRelationships = (record, done) => {
  // this is a workaround until waterline supports conditional
  // joins see balderdashy/waterline#988 and balderdashy/waterline#645
  delete record.active_male_centre_in;
  delete record.active_male_centre_out;
  delete record.active_female_centre_in;
  delete record.active_female_centre_out;
  if (record.active) {
    Detainee.findOne(record.detainee)
      .then(detainee => {
        record[`active_${detainee.gender}_centre_${record.direction}`] = record.centre;
      })
      .finally(() => done());
  } else {
    done();
  }
};

const model = {
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    centre: {
      model: "centres",
      required: true
    },
    detainee: {
      model: "detainee",
      required: true
    },
    active: {
      type: "boolean",
      defaultsTo: true
    },
    direction: {
      type: 'string',
      required: true,
      defaultsTo: 0
    },
    active_male_centre_in: {
      model: "centres"
    },
    active_male_centre_out: {
      model: "centres"
    },
    active_female_centre_in: {
      model: "centres"
    },
    active_female_centre_out: {
      model: "centres"
    }
  },
  beforeUpdate: setNormalisedRelationships,

  beforeCreate: setNormalisedRelationships,

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
  }
};

module.exports = LinkingModels.mixin(ModelHelpers.mixin(model));
