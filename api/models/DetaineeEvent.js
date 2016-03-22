"use strict";

var LinkingModels = require('sails-linking-models');
var ModelHelpers = require('../lib/ModelHelpers');

var getPid = function (entity) {
  entity = entity || this;
  return `${entity.centre}_${entity.person_id}`;
};

const model = {
  schema: true,
  attributes: {
    id: {
      type: 'string',
      required: true,
      defaultsTo: function () {
        return getPid(this);
      }
    },
    person_id: {
      type: 'string',
      required: true
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
  },
  getPid: getPid
};

module.exports = LinkingModels.mixin(ModelHelpers.mixin(model));
