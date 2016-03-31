"use strict";

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
    cid_id: {
      type: 'integer',
      required: true
    },
    timestamp: {
      type: 'date',
      required: true
    }
  },

  afterCreate: function (record, done) {
    this.publishCreate(record);
    done();
  },
  afterUpdate: function (record, done) {
    this.publishUpdate(record.id, record);
    done();
  },
  afterDestroy: function (records, done) {
    _.map(records, (record) => this.publishDestroy(record.id, record));
    done();
  }
};

module.exports = LinkingModels.mixin(ModelHelpers.mixin(model));
