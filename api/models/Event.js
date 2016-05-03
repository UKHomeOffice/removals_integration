'use strict';

var LinkingModels = require('sails-linking-models');
var ModelHelpers = require('../lib/ModelHelpers');

const operations = {
  OPERATION_CHECK_IN: 'check in',
  OPERATION_CHECK_OUT: 'check out',
  OPERATION_REINSTATEMENT: 'reinstatement',
  OPERATION_INTER_SITE_TRANSFER: 'inter site transfer',
  OPERATION_UPDATE: 'update individual'
};

const model = {
  schema: true,
  attributes: {
    centre: {
      model: "centres",
      required: true
    },
    detainee: {
      model: "detainee",
      required: true
    },
    operation: {
      type: 'string',
      required: true,
      enum: Object.keys(operations).map((k) => operations[k])
    },
    timestamp: {
      type: 'datetime',
      required: true
    }
  }
};

Object.assign(model, operations);
module.exports = LinkingModels.mixin(ModelHelpers.mixin(model));