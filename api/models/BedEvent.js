'use strict';

var LinkingModels = require('sails-linking-models');
var ModelHelpers = require('../lib/ModelHelpers');

const operations = {
  OPERATION_OUT_OF_COMMISSION: 'out of commission',
  OPERATION_IN_COMMISSION: 'in commission'
};

const reasons = {
  REASON_SINGLE_OCCUPANCY: "Single Occupancy",
  REASON_DAMAGE: "Maintenance - Malicious/Accidental Damage",
  REASON_HEALTH_AND_SAFETY: "Maintenance - Health and Safety Concern",
  REASON_PLANNED: "Maintenance – Planned works",
  REASON_CRIME: "Crime Scene",
  REASON_MEDICAL: "Medical Isolation",
  REASON_OTHER: "Other"
};

const model = {
  reasons: reasons,
  schema: true,
  attributes: {
    centre: {
      model: "centres",
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
    },
    bed_ref: {
      type: 'string',
      required: true
    },
    reason: {
      type: 'string',
      required: false,
      enum: Object.keys(reasons).map((k) => reasons[k])
    },
    gender: {
      type: 'string',
      enum: ['male', 'female'],
      required: false
    },
    detainee: {
      model: "detainee",
      required: false
    }
  }
};

Object.assign(model, operations, reasons);
module.exports = LinkingModels.mixin(ModelHelpers.mixin(model));
