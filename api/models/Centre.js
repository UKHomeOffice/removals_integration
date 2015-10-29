/**
 * Centre.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var ValidationError = require('../lib/exceptions/ValidationError');


module.exports = {
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
      return {
        type: "centre",
        updated: this.updatedAt,
        name: this.name,
        centre_id: this.id,
        beds: [
          {
            type: "male",
            capacity: this.male_capacity,
            occupied: this.male_in_use,
            ooc: this.male_out_of_commission
          },
          {
            type: "female",
            capacity: this.female_capacity,
            occupied: this.female_in_use,
            ooc: this.female_out_of_commission
          }
        ],
        links: [
          {
            rel: "self",
            href: "/Centre/" + this.id
          }
        ]
      };
    }
  },
  getByName: function (name) {
    return this.findByName(name)
      .then(function (centre) {
        if (centre === undefined || centre.length !== 1) {
          throw new ValidationError("Invalid centre");
        }
        return centre[0];
      });
  }
};

