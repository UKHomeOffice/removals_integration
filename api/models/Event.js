"use strict";

var LinkingModels = require('sails-linking-models');
var ModelHelpers = require('../lib/ModelHelpers');

const OPERATION_CHECK_IN = 'check in';
const OPERATION_CHECK_OUT = 'check out';
const OPERATION_REINSTATEMENT = 'reinstatement';
const OPERATION_INTER_SITE_TRANSFER = 'inter site transfer';
const OPERATION_UPDATE = 'update individual';

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
      enum: [
        OPERATION_CHECK_IN,
        OPERATION_CHECK_OUT,
        OPERATION_REINSTATEMENT,
        OPERATION_INTER_SITE_TRANSFER,
        OPERATION_REINSTATEMENT
      ]
    },
    timestamp: {
      type: 'datetime',
      required: true
    }
  },
  OPERATION_CHECK_IN: OPERATION_CHECK_IN,
  OPERATION_REINSTATEMENT: OPERATION_REINSTATEMENT,
  OPERATION_CHECK_OUT: OPERATION_CHECK_OUT,
  OPERATION_INTER_SITE_TRANSFER: OPERATION_INTER_SITE_TRANSFER,
  OPERATION_UPDATE: OPERATION_UPDATE
};

module.exports = LinkingModels.mixin(ModelHelpers.mixin(model));
