'use strict';

var LinkingModels = require('sails-linking-models');
var ModelHelpers = require('../lib/ModelHelpers');

/**
 * this is a workaround until waterline supports conditional joins see balderdashy/waterline#988
 * and balderdashy/waterline#645
 */
var setNormalisedRelationships = (record, done) => {
  delete record.male_prebooking;
  delete record.female_prebooking;

  record[`${record.gender}_prebooking`] = record.centre;
  done();
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
    gender: {
      type: "string",
      required: true,
      enum: ["male", "female"]
    },
    task_force: {
      type: "string",
      required: true
    },
    cid_id: {
      type: "integer"
    },
    male_prebooking: {
      model: "centres"
    },
    female_prebooking: {
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
