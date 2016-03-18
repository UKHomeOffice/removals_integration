"use strict";

module.exports = {
  findAndUpdateOrCreate: function findAndUpdateOrCreate (criteria, values) {
    return this.update(criteria, values)
      .then(result => _.isEmpty(result) ? this.create(values) : result[0]);
  },
  mixin: function (model) {
    model.findAndUpdateOrCreate = this.findAndUpdateOrCreate;
    model.getPid = this.getPid;
    return model;
  },
  getPid: function getPid () {
    return `${this.centre}_${this.person_id}`;
  }
};
