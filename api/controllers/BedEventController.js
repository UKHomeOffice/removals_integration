/* global BedEvent Event */
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
    let index = _.findIndex(events['out commission'], {bed: event.bed});
    if (index >= 0) {
      events['out commission'].splice(index, 1);
    }
  });
  return events['out commission'];
};

const formatDetaineeEvent = event => {
  return {
    timestamp: event.timestamp,
    centre: event.centre,
    operation: event.operation,
    cid_id: event.detainee.cid_id,
    gender: event.detainee.gender,
    nationality: event.detainee.nationality,
    centre_person_id: event.detainee.person_id
  };
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
  },
  detainees: (req, res) => {
    let where = JSON.parse(req.params.all().where);
    return Event.find(where)
      .populate("detainee")
      .sort("timestamp ASC")
      .toPromise()
      .map(formatDetaineeEvent)
      .then(groupByCentre)
      .then(remapToCentreNames)
      .then(res.ok);
  }
};
