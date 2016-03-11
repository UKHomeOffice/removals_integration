"use strict";

var LinkingModels = require('sails-linking-models');
var ModelHelpers = require('../lib/ModelHelpers');

const model = {
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    id: {
      type: 'string',
      required: true,
      defaultsTo: function () {
        return `${this.centre}_${this.person_id}`
      }
    },
    operation: {
      type: 'string',
      required: true,
      enum: ['check in', 'update']
    },
    cid_id: {
      type: 'integer',
      required: true
    },
    gender: {
      type: 'string',
      enum: ['male', 'female'],
      required: true
    },
    nationality: {
      type: 'string'
    },
    centre: {
      type: 'string',
      required: true
    },
    timestamp: {
      type: 'datetime',
      required: true
    },
    lastTimestamp: {
      type: 'datetime',
      required: true,
      defaultsTo: function () {
        return this.timestamp;
      }
    }
  }
};

module.exports = ModelHelpers.mixin(model);
module.exports = LinkingModels.mixin(model);
