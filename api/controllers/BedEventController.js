/* global BedEvent */
'use strict';
const _ = require('lodash');

const countByReason = _.unary(_.partialRight(_.countBy, "reason"));

const countCentresGenderByReason = centres =>
  _.mapValues(centres, centre =>
    _.mapValues(centre, countByReason)
  );

const groupByCentre = _.unary(_.partialRight(_.groupBy, "centre"));

const groupByGender = _.unary(_.partialRight(_.groupBy, "gender"));

const groupByOperation = _.unary(_.partialRight(_.groupBy, "operation"));

const groupCentresByGender = _.unary(_.partialRight(_.mapValues, groupByGender));

const findNameOfCentre = (centres, id) => _.find(centres, {id: parseInt(id)}).name;

const remapToCentreNames = input =>
  Centres.find()
    .then(centres =>
      _.mapKeys(input, (value, key) =>
        findNameOfCentre(centres, key)
      )
    );

const formatBedEvent = input => {
  return {
    operation: input.operation,
    bed: input.bed.id,
    gender: input.bed.gender,
    centre: input.bed.centre,
    reason: input.reason
  };
};

const removeOutOfCommissionsWithInCommissions = events => {
  _.each(events["in commission"], (event) => {
    events['out commission'].splice(_.findLastIndex(events['out commission'], {bed: event.bed}), 1);
  });
  return events['out commission'];
};

module.exports = {
  summary: (req, res) => {
    let where = JSON.parse(req.params.all().where);
    let greaterThan = where.timestamp.greaterThan;
    let lessThan = where.timestamp.lessThan;

    let newwhere = [
      {
        operation: "out commission",
        timestamp: {
          lessThan: lessThan
        }
      },
      {
        operation: "in commission",
        timestamp: {
          lessThan: greaterThan
        }
      }
    ];
    return BedEvent.find(newwhere)
      .populate("bed")
      .sort("timestamp ASC")
      .toPromise()
      .map(formatBedEvent)
      .then(groupByOperation)
      .then(removeOutOfCommissionsWithInCommissions)
      .then(groupByCentre)

      .then(groupCentresByGender)
      .then(countCentresGenderByReason)

      .then(remapToCentreNames)
      .then(res.ok);
  }
};
