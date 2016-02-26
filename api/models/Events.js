"use strict";

var LinkingModels = require('sails-linking-models');
var ModelHelpers = require('../lib/ModelHelpers');

const model = {
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    operation: {
      type: 'string',
      required: true,
      enum: ['check in']
    },
    timestamp: {
      type: 'datetime',
      required: true
    },
    detainee: {
      model: 'detainees'
    }
  }
};

module.exports = ModelHelpers.mixin(model);
module.exports = LinkingModels.mixin(model);
