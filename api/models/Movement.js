'use strict';

var LinkingModels = require('sails-linking-models');
var ModelHelpers = require('../lib/ModelHelpers');

const model = {
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    centre: {
      model: "centres",
      required: true
    },
    active: {
      type: "boolean",
      defaultsTo: true
    },
    direction: {
      type: 'string',
      required: true,
      enum: ['in', 'out']
    },
    gender: {
      type: 'string',
      enum: ['male', 'female'],
      required: true
    },
    mo_ref: {
      type: 'integer',
      required: true
    },
    cid_id: {
      type: 'integer',
      required: true
    },
    timestamp: {
      type: 'date',
      required: true
    }
  }
};

module.exports = LinkingModels.mixin(ModelHelpers.mixin(model));
