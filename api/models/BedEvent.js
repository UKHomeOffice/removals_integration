/* global BedEvent */
'use strict';

var DuplicationError = require('../lib/exceptions/DuplicationError');
var LinkingModels = require('sails-linking-models');
var ModelHelpers = require('../lib/ModelHelpers');

const operations = {
  OPERATION_OUT_OF_COMMISSION: 'out commission',
  OPERATION_IN_COMMISSION: 'in commission'
};

const reasons = {
  REASON_SINGLE_OCCUPANCY: "Single Occupancy",
  REASON_DAMAGE: "Maintenance - Malicious/Accidental Damage",
  REASON_HEALTH_AND_SAFETY: "Maintenance - Health and Safety Concern",
  REASON_PLANNED: "Maintenance - Planned works",
  REASON_CRIME: "Crime Scene",
  REASON_MEDICAL: "Medical Isolation",
  REASON_OTHER: "Other"
};

const model = {
  autoCreatedAt: true,
  autoUpdatedAt: true,
  reasons: reasons,
  schema: true,
  attributes: {
    bed: {
      model: "bed",
      required: true,
      defaultsTo: null
    },
    detainee: {
      model: "detainee",
      required: false
    },
    timestamp: {
      type: 'datetime',
      required: true
    },
    operation: {
      type: 'string',
      required: true,
      enum: Object.keys(operations).map((k) => operations[k])
    },
    reason: {
      type: 'string',
      required: false,
      defaultsTo: null,
      enum: Object.keys(reasons).map((k) => reasons[k])
    },
    active: {
      type: 'boolean',
      required: true
    }
  },

  getOOCByCentreGroupByGenderAndReason: (centreId) =>
    BedEvent.getCurrentOOCByCentre(centreId)
      .then(BedEvent.groupByGender)
      .then(BedEvent.groupAndCountByReason),

  /**
   * The implementation below is intended and not redundant:
   * sails version 0.11.5 presumably has an issue where sails-mysql doesn't consistently
   * do populates with where clauses in the same way that sails-memory does, hence the
   * requirement to filter event.bed.centre === centreId post populate with where
   */
  getCurrentOOCByCentre: (centreId) =>
    BedEvent.find({
      where: {
        active: true,
        operation: operations.OPERATION_OUT_OF_COMMISSION
      }
    })
    .populate('bed', {
      where: {
        centre: centreId
      }, select: ['gender', 'centre']
    })
    .toPromise()
    .filter((event) => !_.isEmpty(event.bed) && event.bed.centre === centreId),

  groupByGender: (events) =>
    _.groupBy(events, (e) => e.bed.gender),

  groupAndCountByReason: (events) =>
    _.mapValues(events, (value) =>
      _.countBy(value, "reason")
    ),

  deactivatePastBedEvents: (bid, timestamp) =>
    BedEvent.update({bed: bid, timestamp: {'<=': new Date(timestamp)}}, {active: false}),

  afterValidate: (values, cb) =>
    BedEvent.find({
      bed: values.bed,
      detainee: values.detainee,
      operation: values.operation,
      timestamp: values.timestamp,
      reason: values.reason
    })
    .then(bedevents => {
      if (bedevents.length > 0) {
        return cb(new DuplicationError("Duplicate event"));
      }
      cb();
    })
};

Object.assign(model, operations, reasons);
module.exports = LinkingModels.mixin(ModelHelpers.mixin(model));
