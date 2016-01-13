"use strict";

var ValidationError = require('../lib/exceptions/ValidationError');
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

module.exports = ModelHelpers.mixin(model);
module.exports = LinkingModels.mixin(model);
