/* global Movement CidEntryMovementValidatorService Prebooking Port */
'use strict';

const ValidationError = require('../lib/exceptions/ValidationError');
const moment = require('moment');
const _ = require('lodash');
const failedRemovalReturnType = "Failed-Removal-Return";
const nonOccupancyType = "Non-Occupancy";

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
    Movement.findAndUpdateOrCreate(
      {
        centre: movement.centre,
        mo_ref: movement['MO Ref']
      },
      {
        centre: movement.centre,
        mo_ref: movement['MO Ref'],
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
    movement['MO In/MO Out'] = movement['MO In/MO Out'].toLowerCase().trim();
    movement['MO Date'] = moment(movement['MO Date'], 'DD/MM/YYYY HH:mm:ss').toDate();
    return movement;
  },

  filterNonOccupancyMovements: movement => movement['MO Type'] !== nonOccupancyType,

  manipulatePortMovements: movements =>
    Port.find()
      .toPromise()
      .map(port => port.location)
      .then(ports => {
        _.each(movements, (movement) => {
          if (movement['MO Type'] === nonOccupancyType && _.includes(ports, movement.Location)) {
            movements = _.map(movements, (movementb) => {
              if (movementb['MO Ref'] === movement['MO Ref']) {
                movementb["MO Type"] = failedRemovalReturnType;
              }
              return movementb;
            });
          }
        });
        return movements;
      }),

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

  filterInnerCentreMovements: (movements) => {
    _.each(_.filter(movements, {'MO In/MO Out': 'in'}), movement => {
      if (_.find(movements, {
        'MO In/MO Out': 'out',
        'MO Ref': movement['MO Ref'],
        'CID Person ID': movement['CID Person ID'],
        'MO Type': movement['MO Type'],
        centre: movement.centre
      })) {
        _.remove(movements, {'MO Ref': movement['MO Ref']});
      }
    });
    return movements;
  },

  updateReceivedDate: (movements) =>
    Centres.update({}, {cid_received_date: new Date()})
      .then(() => movements),

  movementPost: function (req, res) {
    return CidEntryMovementValidatorService.validate(req.body)
      .tap(() => res.ok())
      .then(body => body.cDataSet)
      .map(this.formatMovement)
      .then(this.manipulatePortMovements)
      .filter(this.filterNonOccupancyMovements)
      .map(this.populateMovementWithCentreAndGender)
      .filter(this.filterNonEmptyMovements)
      .then(this.filterInnerCentreMovements)
      .tap(this.removePrebookingWithRelatedMovement)
      .map(this.movementProcess)
      .then(this.markNonMatchingMovementsAsInactive)
      .then(this.updateReceivedDate)
      .tap(Centres.publishUpdateAll)
      .catch(ValidationError, error => {
        res.badRequest(error.result.errors[0].message);
      })
      .catch(error => {
        res.serverError(error.message);
      });
  }
};
