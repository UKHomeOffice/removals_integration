/**
 * Centre.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    name: {
      type: "string",
      required: true
    },
    male_capacity: {
      type: "integer",
      required: true
    },
    female_capacity: {
      type: "integer",
      required: true
    },
    male_in_use: {
      type: "integer",
      required: true
    },
    female_in_use: {
      type: "integer",
      required: true
    },
    male_out_of_commission: {
      type: "integer",
      required: true
    },
    female_out_of_commission: {
      type: "integer",
      required: true
    }
  }
};
