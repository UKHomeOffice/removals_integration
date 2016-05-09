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
  delete record.male_contingency;
  delete record.female_contingency;

  if (record.contingency) {
    record[`${record.gender}_contingency`] = record.centre;
  } else {
    record[`${record.gender}_prebooking`] = record.centre;
  }

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
    contingency: {
      type: "boolean",
      defaultsTo: false
    },
    male_prebooking: {
      model: "centres"
    },
    female_prebooking: {
      model: "centres"
    },
    male_contingency: {
      model: "centres"
    },
    female_contingency: {
      model: "centres"
    }
  },
  beforeUpdate: setNormalisedRelationships,

  beforeCreate: setNormalisedRelationships

};

module.exports = LinkingModels.mixin(ModelHelpers.mixin(model));
