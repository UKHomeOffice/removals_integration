/* global Movement CidEntryMovementValidatorService Prebooking */
'use strict';

var ValidationError = require('../lib/exceptions/ValidationError');
var moment = require('moment');

module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: false,
    exposedMethods: [
      'movement'
    ]
  },

  movementOptions: (req, res) => res.ok(CidEntryMovementValidatorService.schema),

  movementProcess: movement =>
    Movement.findAndUpdateOrCreate(movement['MO Ref.'],
      {
        centre: movement.centre,
        id: movement['MO Ref.'],
        cid_id: movement['CID Person ID'],
        timestamp: movement["MO Date"],
        direction: movement['MO In/MO Out'],
        gender: movement.gender,
        active: true
      }
    ),

  removePrebookingWithRelatedMovement: movements =>
    Prebooking.destroy({
      cid_id: movements.map(movement => movement['CID Person ID'])
    }),

  formatMovement: movement => {
    movement['MO Ref.'] = parseInt(movement['MO Ref.']);
    movement['CID Person ID'] = parseInt(movement['CID Person ID']);
    movement['MO In/MO Out'] = movement['MO In/MO Out'].toLowerCase().trim();
    movement['MO Date'] = moment(movement['MO Date'], 'DD/MM/YYYY HH:mm:ss').toDate();
    return movement;
  },

  filterNonOccupancyMovements: movement => movement['MO Type'] !== "Non-Occupancy",

  populateMovementWithCentreAndGender: movement =>
    _.memoize(Centres.getGenderAndCentreByCIDLocation)(movement.Location)
      .then(result => _.merge(movement, result)),

  filterNonEmptyMovements: movement => movement.centre && movement['MO Ref.'] > 1,

  markNonMatchingMovementsAsInactive: movements =>
    Movement.update(
      {
        id: {
          not: _.map(movements, movement => movement.id)
        }
      },
      {
        active: false
      }
    ),

  publishCentreUpdates: movements =>
    Centres.find()
      .then(centres => _.map(centres, centre => Centres.publishUpdate(centre.id, centre)))
      .then(() => Centres.update({cid_received_date: new Date()}))
      .then(() => movements),

  updateReceivedDate: (movements) =>
    Centres.update({}, {cid_received_date: new Date()})
      .then(() => movements),

  movementPost: function (req, res) {
    return CidEntryMovementValidatorService.validate(req.body)
      .then(body => body.Output)
      .map(this.formatMovement)
      .filter(this.filterNonOccupancyMovements)
      .map(this.populateMovementWithCentreAndGender)

      .filter(this.filterNonEmptyMovements)

      .tap(this.removePrebookingWithRelatedMovement)
      .map(this.movementProcess)
      .then(this.markNonMatchingMovementsAsInactive)
      .then(this.updateReceivedDate)
      .then(Centres.publishCentreUpdates)
      .then(res.ok)
      .catch(ValidationError, error => {
        res.badRequest(error.result.errors[0].message);
      })
      .catch(error => {
        res.serverError(error.message);
      });
  }
};
