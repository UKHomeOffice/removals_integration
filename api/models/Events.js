"use strict";

var LinkingModels = require('sails-linking-models');
var ModelHelpers = require('../lib/ModelHelpers');

const model = {
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  autoPK: false,
  attributes: {
    operation: {
      type: 'string',
      required: true,
      enum: ['check in']
    },
    event_received: {
      type: 'datetime',
      required: true
    },
    person_id: {
      type: 'string',
      required: true,
      primaryKey: true
    }
  }
};

module.exports = ModelHelpers.mixin(model);
module.exports = LinkingModels.mixin(model);
