/* global*/
'use strict';

var LinkingModels = require('sails-linking-models');
var ModelHelpers = require('../lib/ModelHelpers');

var getPid = (entity) => `${entity.centre.id}_${entity.person_id}`;

const model = {
  schema: true,
  attributes: {
    person_id: {
      type: 'string',
      required: true
    },
    centre: {
      model: "centres",
      required: true
    },
    cid_id: {
      type: 'integer'
    },
    gender: {
      type: 'string',
      enum: ['male', 'female']
    },
    nationality: {
      type: 'string'
    },
    timestamp: {
      type: 'datetime',
      required: true
    },
    originalTimestamp: {
      type: 'datetime',
      required: true,
      defaultsTo: function () {
        return this.timestamp;
      }
    },
    events: {
      collection: 'event',
      via: 'detainee'
    }
  },
  getPid: getPid
};

module.exports = LinkingModels.mixin(ModelHelpers.mixin(model));
