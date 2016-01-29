"use strict";

var ValidationError = require('../lib/exceptions/ValidationError');
var LinkingModels = require('sails-linking-models');

const model = {
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    heartbeat_recieved: {
      type: "datetime"
    },
    name: {
      type: "string",
      defaultsTo: 0,
      required: true,
      unique: true
    },
    male_capacity: {
      type: "integer",
      defaultsTo: 0,
      required: true
    },
    female_capacity: {
      type: "integer",
      defaultsTo: 0,
      required: true
    },
    male_in_use: {
      type: "integer",
      defaultsTo: 0,
      required: true
    },
    female_in_use: {
      type: "integer",
      defaultsTo: 0,
      required: true
    },
    male_out_of_commission: {
      type: "integer",
      defaultsTo: 0,
      required: true
    },
    female_out_of_commission: {
      type: "integer",
      defaultsTo: 0,
      required: true
    },
    toJSON: function () {
      const maleCapacity = this.male_capacity - this.male_in_use;
      const femaleCapacity = this.female_capacity - this.female_in_use;
      const response = {
        type: "centre",
        id: this.id.toString(),
        attributes: {
          updated: this.updatedAt,
          heartbeatRecieved: this.heartbeat_recieved ? this.heartbeat_recieved.toString() : null,
          name: this.name,
          maleCapacity: this.male_capacity,
          femaleCapacity: this.female_capacity,
          maleInUse: this.male_in_use,
          femaleInUse: this.female_in_use,
          maleOutOfCommission: this.male_out_of_commission,
          femaleOutOfCommission: this.female_out_of_commission,
          maleAvailability: maleCapacity - this.male_out_of_commission,
          femaleAvailability: femaleCapacity - this.female_out_of_commission
        },
        links: this.modelLinks('centre', reverseRouteService)
      };
      return response;
    }
  },
  getByName: function (name) {
    return this.findByName(name)
      .then((centre) => {
        if (centre === undefined || centre.length !== 1) {
          throw new ValidationError("Invalid centre");
        }
        return centre[0];
      });
  }
};

module.exports = LinkingModels.mixin(model);
