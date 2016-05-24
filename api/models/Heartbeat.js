'use strict';

var LinkingModels = require('sails-linking-models');
var ModelHelpers = require('../lib/ModelHelpers');

const model = {
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: false,
  attributes: {
    centre: {
      model: "centres",
      required: true
    },
    male_in_use: {
      type: 'integer',
      defaultsTo: 0,
      required: true
    },
    female_in_use: {
      type: 'integer',
      defaultsTo: 0,
      required: true
    },
    male_out_of_commission: {
      type: 'integer',
      defaultsTo: 0,
      required: true
    },
    female_out_of_commission: {
      type: 'integer',
      defaultsTo: 0,
      required: true
    },
    toJSON: function () {
      this.centre = this.centre.toJSON();
      this.centre.name = this.centre.attributes.name;
      delete this.centre.attributes;
      delete this.centre.type;
      return {
        id: this.id.toString(),
        links: this.modelLinks('heartbeat', reverseRouteService),
        attributes: {
          centre: this.centre,
          timestamp: this.createdAt,
          maleInUse: this.male_in_use,
          femaleInUse: this.female_in_use,
          maleOutOfCommission: this.male_out_of_commission,
          femaleOutOfCommission: this.female_out_of_commission,
        }
      };
    }
  }
};

module.exports = LinkingModels.mixin(ModelHelpers.mixin(model));
