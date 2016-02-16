/* global Movement CidEntryMovementValidatorService Detainee */
'use strict';

var ValidationError = require('../lib/exceptions/ValidationError');

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
    Movement.findAndUpdateOrCreate(movement['MO Ref'],
      {
        centre: movement.centre,
        detainee: movement.detainee,
        id: movement['MO Ref'],
        direction: movement['MO In/MO Out'],
        active: true
      }
    ),

  detaineeProcess: movement =>
    Detainee.findAndUpdateOrCreate(
      {cid_id: movement['CID Person ID']},
      {
        cid_id: movement['CID Person ID'],
        gender: movement.gender
      }
      )
      .then(detainee => _.merge(movement, {detainee: detainee.id})),

  formatMovement: movement => {
    movement['MO Ref'] = parseInt(movement['MO Ref']);
    movement['MO In/MO Out'] = movement['MO In/MO Out'].toLowerCase().trim();
    return movement;
  },

  removeNonOccupancy: movement =>
    Centres.removeNonOccupancy().then(() => movement),

  populateMovementWithCentreAndGender: movement =>
    _.memoize(Centres.getGenderAndCentreByCIDLocation)(movement.Location)
      .then(result => _.merge(movement, result)),

  filterNonEmptyMovements: movement => movement.centre && movement['MO Ref'] > 1,


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
      .populate('male_active_movements_in')
      .populate('male_active_movements_out')
      .populate('female_active_movements_in')
      .populate('female_active_movements_out')
      .then(centres => _.map(centres, centre => Centres.publishUpdate(centre.id, centre)))
      .then(() => movements),

  movementPost: function (req, res) {
    return CidEntryMovementValidatorService.validate(req.body)
      .then(body => body.cDataSet)
      .map(this.formatMovement)

      .then(this.removeNonOccupancy)

      .map(this.populateMovementWithCentreAndGender)

      .filter(this.filterNonEmptyMovements)

      .map(this.detaineeProcess)
      .map(this.movementProcess)

      .then(this.markNonMatchingMovementsAsInactive)
      .then(this.publishCentreUpdates)

      .then(res.ok)
      .catch(ValidationError, error => {
        res.badRequest(error.message);
      })
      .catch(error => {
        res.serverError(error.message);
      });
  }
};
