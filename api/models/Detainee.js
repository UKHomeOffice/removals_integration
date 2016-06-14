'use strict';

var LinkingModels = require('sails-linking-models');
var ModelHelpers = require('../lib/ModelHelpers');
var ValidationError = require('../lib/exceptions/ValidationError');

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
  getPid: getPid,
  normalizeGender: function (gender) {
    switch (gender) {
    case 'f':
    case 'female':
      return 'female';

    case 'm':
    case 'male':
      return 'male';

    case undefined:
    case '':
    case null:
      return undefined;
    }
    throw new ValidationError('Unknown Gender');
  }
};

module.exports = LinkingModels.mixin(ModelHelpers.mixin(model));
