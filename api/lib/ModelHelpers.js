'use strict';

const _ = require('lodash');

module.exports = {
  findAndUpdateOrCreate: function findAndUpdateOrCreate (criteria, values) {
    return this.update(criteria, values)
      .then(result => _.isEmpty(result) ? this.create(values) : result[0]);
  },
  normalizeGender: (gender) => {
    switch (gender) {
    case 'f':
    case 'female':
      gender = 'female';
      break;
    case 'm':
    case 'male':
      gender = 'male';
      break;
    default:
      gender = null;
    }
    return gender;
  },
  mixin: function (model) {
    model.normalizeGender = this.normalizeGender;
    model.findAndUpdateOrCreate = this.findAndUpdateOrCreate;
    return model;
  }
};
