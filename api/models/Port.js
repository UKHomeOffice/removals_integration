'use strict';

const LinkingModels = require('sails-linking-models');
const ModelHelpers = require('../lib/ModelHelpers');

const model = {
  autoCreatedAt: true,
  autoUpdatedAt: true,
  schema: true,
  attributes: {
    location: {
      type: 'string',
      required: true
    }
  }
};

module.exports = LinkingModels.mixin(ModelHelpers.mixin(model));
