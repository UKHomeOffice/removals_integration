"use strict";
/**
 * Centres.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var ValidationError = require('../lib/exceptions/ValidationError');
var LinkingModels = require('sails-linking-models');
const model = {
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
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
      let response = {
        type: "centres",
        id: this.id.toString(),
        attributes: {
          updated: this.updatedAt,
          name: this.name,
          maleCapacity: this.male_capacity,
          femaleCapacity: this.female_capacity,
          maleInUse: this.male_in_use,
          femaleInUse: this.female_in_use,
          maleOutOfCommission: this.male_out_of_commission,
          femaleOutOfCommission: this.female_out_of_commission,
          maleAvailability: this.male_capacity - this.male_in_use - this.male_out_of_commission,
          femaleAvailability: this.female_capacity - this.female_in_use - this.female_out_of_commission,
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
