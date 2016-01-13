"use strict";

var ValidationError = require('../lib/exceptions/ValidationError');
var LinkingModels = require('sails-linking-models');
var ModelHelpers = require('../lib/ModelHelpers');

const model = {
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  autoPK: false,
  attributes: {
    centre: {
      model: "centre",
      required: true
    },
    detainee: {
      model: "detainee",
      required: true
    },
    movementOrderRef: {
      type: "integer",
      required: true,
      unique: true,
      primaryKey: true
    },
    active: {
      type: "boolean",
      defaultsTo: true,
    }
  }
};

module.exports = LinkingModels.mixin(ModelHelpers.mixin(model));
