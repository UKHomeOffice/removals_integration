"use strict";

module.exports = {
  findAndUpdateOrCreate: function findAndUpdateOrCreate(criteria, values) {
    return this.update(criteria, values)
      .then(result => {
        if (!_.isEmpty(result)) {
          return result[0];
        } else {
          return this.create(values);
        }
      })
  },
  mixin: function (model) {
    model.findAndUpdateOrCreate = this.findAndUpdateOrCreate;
    return model;
  }
};
