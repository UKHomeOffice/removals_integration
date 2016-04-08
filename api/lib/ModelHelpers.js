"use strict";

module.exports = {
  findAndUpdateOrCreate: function findAndUpdateOrCreate(criteria, values) {
    return this.update(criteria, values)
      .then(result => _.isEmpty(result) ? this.create(values) : result[0]);
  },
  mixin: function (model) {
    model.findAndUpdateOrCreate = this.findAndUpdateOrCreate;
    return model;
  }
};
