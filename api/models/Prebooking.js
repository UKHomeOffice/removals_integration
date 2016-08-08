/* global Prebooking */
'use strict';

const _ = require('lodash');
const LinkingModels = require('sails-linking-models');
const ModelHelpers = require('../lib/ModelHelpers');

const model = {
  schema: true,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    centre: {
      model: "centres",
      required: true
    },
    gender: {
      type: "string",
      required: true,
      enum: ["male", "female"]
    },
    task_force: {
      type: "string",
      required: true
    },
    cid_id: {
      type: "integer"
    },
    contingency: {
      type: "boolean",
      defaultsTo: false
    }
  },

  getPrebookingByCentreGroupByGenderCidOrTaskForce: (centreId, contingency) =>
    Prebooking.getPrebookingsByCentreAndContingency(centreId, contingency)
      .map(Prebooking.unsetTaskForceIfCidIdIsSet)
      .then(Prebooking.groupByGender)
      .then(Prebooking.groupAndCountByCidAlternativelyTaskForce),

  getPrebookingsByCentreAndContingency: (centreId, contingency) =>
    Prebooking.find(
      {
        where: {
          centre: centreId,
          contingency: contingency
        },
        select: ['gender', 'task_force', 'cid_id']
      })
      .toPromise()
      .map((booking) => _.omitBy(booking, _.isNil)),

  unsetTaskForceIfCidIdIsSet: (booking) => {
    if (_.has(booking, 'cid_id')) {
      _.unset(booking, 'task_force');
    }
    return booking;
  },

  groupByGender: (prebookings) =>
    _.groupBy(prebookings, (prebooking) => prebooking.gender),

  groupAndCountByCidAlternativelyTaskForce: (bookings) => {
    var collection = {female: {}, male: {}};
    ['male', 'female'].forEach((gender) => {
      _.set(collection[gender], 'detail',
        _.omit(_.merge(
          _.mapValues(bookings, (value) =>
            _.countBy(value, 'cid_id')
          ),
          _.mapValues(bookings, (value) =>
            _.countBy(value, 'task_force')
          )
        )[gender], ['undefined']));
      _.set(collection[gender], 'total',
        _.reduce(collection[gender].detail, function (sum, n) {
          return sum + n;
        }, 0));
    });
    return collection;
  }
};

module.exports = LinkingModels.mixin(ModelHelpers.mixin(model));
