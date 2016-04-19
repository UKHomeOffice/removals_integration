"use strict";

var LinkingModels = require('sails-linking-models');
var ModelHelpers = require('../lib/ModelHelpers');

const model = {
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    gender: {
      type: "string",
      required: true,
      enum: ["male", "female"]
    },
    cid_id: {
      type: "integer",
      required: true
    }
  }
};

ModelHelpers.mixin(model);
LinkingModels.mixin(model);

module.exports = model;
