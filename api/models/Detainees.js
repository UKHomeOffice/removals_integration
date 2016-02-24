"use strict";

var LinkingModels = require('sails-linking-models');
var ModelHelpers = require('../lib/ModelHelpers');

const model = {
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  autoPK: false,
  attributes: {
    person_id: {
      type: 'string',
      required: true,
      unique: true,
      primaryKey: true
    },
    cid_id: {
      type: "integer"
    },
    gender: {
      type: "string",
      enum: ["male", "female"]
    },
    nationality: {
      type: 'string'
    },
    centre: {
      model: 'centres'
    }
  }
};

module.exports = ModelHelpers.mixin(model);
module.exports = LinkingModels.mixin(model);
