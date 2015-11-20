"use strict";
/**
 * Centre.js
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
        type: "centre",
        updated: this.updatedAt,
        name: this.name,
        centre_id: this.id,
        beds: [],
        links: this.modelLinks('centre', reverseRouteService)
      };
      if (this.male_capacity && this.male_capacity > 0) {
        response.beds.push(
          {
            type: "male",
            capacity: this.male_capacity,
            occupied: this.male_in_use,
            ooc: this.male_out_of_commission
          }
        );
      }
      if (this.female_capacity && this.female_capacity > 0) {
        response.beds.push(
          {
            type: "female",
            capacity: this.female_capacity,
            occupied: this.female_in_use,
            ooc: this.female_out_of_commission
          }
        );
      }
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
