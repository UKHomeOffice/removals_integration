var ValidationError = require('../lib/exceptions/ValidationError');

var movementSchema = {};

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
        movementOrderRef: movement['MO Ref'],
        active: true,
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

  populateMovementWithCentreAndGender: movement =>
    Centre.getGenderAndCentreByCIDLocation(movement.Location)
      .then(result => _.merge(movement, result)),

  filterNonEmptyMovements: movement =>
    (movement.centre &&
    movement['MO Ref'] > 1),

  filterOnlyInMovements: movement => movement['MO In/MO Out'] == 'in',

  markNonMatchingMovementsAsInactive: movements =>
    Movement.update(
      {movementOrderRef: {'not': movements}},
      {active: false}
    ),

  movementPost: function (req, res) {
    return CidEntryMovementValidatorService.validate(req.body)
      .then(body => body.cDataSet)
      .map(this.formatMovement)
      .filter(this.filterOnlyInMovements)

      .map(this.populateMovementWithCentreAndGender)

      .filter(this.filterNonEmptyMovements)

      .map(this.detaineeProcess)
      .map(this.movementProcess)

      .map(movement => movement.movementOrderRef)
      .then(this.markNonMatchingMovementsAsInactive)

      .then(res.ok)
      .catch(ValidationError, error => {
        res.badRequest(error.message);
      })
      .catch(error => {
        res.serverError(error.message);
      });
  }

};
