/* global Movement CidEntryMovementValidatorService Subjects */
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
        id: movement['MO Ref'],
        cid_id: movement['CID Person ID'],
        timestamp: movement["MO Date"],
        direction: movement['MO In/MO Out'],
        gender: movement.gender,
        active: true
      }
    ),

  subjectsProcess: movement =>
    Subjects.findAndUpdateOrCreate(
      {cid_id: movement['CID Person ID']},
      {
        cid_id: movement['CID Person ID'],
        gender: movement.gender
      }
      )
      .then(subjects => _.merge(movement, {subjects: subjects.id})),

  formatMovement: movement => {
    movement['MO Ref'] = parseInt(movement['MO Ref']);
    movement['MO In/MO Out'] = movement['MO In/MO Out'].toLowerCase().trim();
    movement['MO Date'] = new Date(movement['MO Date']);
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
      .then(centres => _.map(centres, centre => Centres.publishUpdate(centre.id, centre)))
      .then(() => Centres.update({cid_received_date: new Date()}))
      .then(() => movements),

  movementPost: function (req, res) {
    return CidEntryMovementValidatorService.validate(req.body)
      .then(body => body.cDataSet)
      .map(this.formatMovement)

      .then(this.removeNonOccupancy)

      .map(this.populateMovementWithCentreAndGender)

      .filter(this.filterNonEmptyMovements)

      .map(this.subjectsProcess)
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
