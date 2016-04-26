/* global Prebooking DepmuEntryPrebookingValidatorService Movement */
'use strict';

var ValidationError = require('../lib/exceptions/ValidationError');
var moment = require('moment-timezone');
moment.tz.setDefault("Europe/London");

module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: false,
    exposedMethods: [
      'prebooking'
    ]
  },

  prebookingOptions: (req, res) => res.ok(DepmuEntryPrebookingValidatorService.schema),

  truncatePrebookings: () =>
    Prebooking.destroy({}),

  formatPrebooking: prebooking => {
    prebooking.cid_id = prebooking.cid_id ? parseInt(prebooking.cid_id) : null;
    prebooking.location = prebooking.location.toLowerCase().trim();
    prebooking.task_force = prebooking.task_force.toLowerCase().trim();
    prebooking.timestamp = new Date(prebooking.timestamp);
    return prebooking;
  },

  populatePrebookingWithContingency: prebooking => {
    prebooking.contingency = prebooking.task_force.startsWith('depmu') || prebooking.task_force.startsWith('htu');
    return prebooking;
  },

  populatePrebookingWithCentreAndGender: prebooking =>
    _.memoize(Centres.getGenderAndCentreByCIDLocation)(prebooking.location)
      .then(result =>
        _.merge(prebooking, result)),

  filterNonEmptyPrebookings: prebooking =>
  prebooking.centre && prebooking.gender && prebooking.task_force && prebooking.timestamp,

  filterCurrentRangePrebookings: prebooking => {
    var startOfDay = moment().set({hour: 7, minute: 0, second: 0, millisecond: 0});
    var endOfDay = moment(startOfDay).add(1, 'day');
    var prebookingTimestamp = moment(prebooking.timestamp);
    return prebookingTimestamp.isSameOrAfter(startOfDay) && prebookingTimestamp.isBefore(endOfDay);
  },

  filterPrebookingsWithNoMovementOrder: prebooking => {
    if (prebooking.cid_id !== null) {
      return Movement.find({active: true, direction: 'in'})
        .populate('detainee', {cid_id: prebooking.cid_id})
        .toPromise()
        .filter(movement => Boolean(movement.detainee))
        .then(movements => movements.length < 1);
    }
    return true;
  },

  emptyCheck: prebookings => {
    if (prebookings.length < 1) {
      throw new RangeError("No prebookings to process in expected time range");
    }
  },

  prebookingProcess: prebooking =>
    Prebooking.create(
      {
        centre: prebooking.centre,
        gender: prebooking.gender,
        task_force: prebooking.task_force,
        contingency: prebooking.contingency,
        cid_id: prebooking.cid_id
      })
      .then(() => prebooking),

  updateReceivedDate: () =>
    Centres.update({}, {prebooking_received: new Date()}),

  prebookingPost: function (req, res) {
    return DepmuEntryPrebookingValidatorService.validate(req.body)
      .then(body => body.Output)
      .map(this.formatPrebooking)
      .map(this.populatePrebookingWithContingency)
      .map(this.populatePrebookingWithCentreAndGender)
      .filter(this.filterNonEmptyPrebookings)
      .filter(this.filterCurrentRangePrebookings)
      .filter(this.filterPrebookingsWithNoMovementOrder)
      .tap(this.emptyCheck)
      .tap(this.truncatePrebookings)
      .map(this.prebookingProcess)
      .tap(this.updateReceivedDate)
      .tap(Centres.publishCentreUpdates)
      .then(res.ok)
      .catch(ValidationError, error => res.badRequest(error.result.errors[0].message))
      .catch(RangeError, error => res.unprocessableEntity(error))
      .catch(error => res.serverError(error.message));
  }
};
