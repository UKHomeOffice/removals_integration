/* global Event Movement */
'use strict';

var DateRange = require('../lib/DateRange');
var moment = require('moment');

const fullRange = (visibilityRange, rangeFactory) =>
  DateRange.widen.apply(null, [visibilityRange, rangeFactory(visibilityRange.from), rangeFactory(visibilityRange.to)]);

const populate = (model, centreId, range) =>
  model.find({
    where: {
      centre: centreId,
      timestamp: {'>=': range.from, '<=': range.to}
    },
    sort: 'timestamp'
  });

const populateEvents = (centre, range) =>
  populate(Event, centre.id, range)
    .populate('detainee')
    .then(events => {
      events.forEach((event) => {
        if (event.operation === Event.OPERATION_REINSTATEMENT) {
          centre.unreconciledReinstatements.push(event);
        } else {
          centre.unreconciledEvents.push(event);
        }
      });
    });

const populateMovements = (centre, range) =>
  populate(Movement, centre.id, range)
    .then(movements => centre.unreconciledMovements = movements);

const resolveEventOperationWithMovementDirection = (operation) => {
  switch (operation) {
  case 'check in':
    return 'in';
  case 'check out':
    return 'out';
  default:
    return 'unknown';
  }
};

const getReconciliationTester = (movementsRangeFactory, eventsRangeFactory) => (event, movement) => {
  const cidMatches = movement.cid_id === event.detainee.cid_id;
  const directionMatches = resolveEventOperationWithMovementDirection(event.operation) === movement.direction;
  const timestampMatches = movementsRangeFactory(event.timestamp).contains(movement.timestamp) || eventsRangeFactory(movement.timestamp).contains(event.timestamp);

  return cidMatches && directionMatches && timestampMatches && {event, movement};
};

const filterUnreconciled = (centre, range) => {
  centre.unreconciledEvents = centre.unreconciledEvents.filter(event => range.contains(event.timestamp));
  centre.unreconciledMovements = centre.unreconciledMovements.filter(movement => range.contains(movement.timestamp));
};

const getReinstatementTester = (checkoutEventsRangeFactory) => (reinstatement, event) => {
  const operationMatches = event.operation === Event.OPERATION_CHECK_OUT;
  const personIdMatches = reinstatement.person_id === event.person_id;
  const timestampMatches = checkoutEventsRangeFactory(reinstatement.timestamp).contains(event.timestamp);

  return operationMatches && personIdMatches && timestampMatches && {reinstatement, event};
};

const untersect = (left, right, mapper) => {
  const matches = [];
  const rightExclusive = right.slice(0);

  const leftExclusive = left.filter((leftThing) =>
    !rightExclusive.some((rightThing, rightKey) => {
      const result = mapper(leftThing, rightThing);
      if (result) {
        matches.push(result);
        rightExclusive.splice(rightKey, 1);
        return true;
      }
      return false;
    })
  );
  return [leftExclusive, matches, rightExclusive];
};

const reconcileEvents = (centre, tester) => {
  const result = untersect(centre.unreconciledEvents, centre.unreconciledMovements, tester);
  centre.unreconciledEvents = result[0];
  centre.reconciled = result[1];
  centre.unreconciledMovements = result[2];
  return centre;
};

const handleReinstatements = (centre, tester) => {
  const result = untersect(centre.unreconciledReinstatements, centre.unreconciledEvents, tester);
  centre.unreconciledReinstatements = result[0];
  centre.reinstatements = result[1];
  centre.unreconciledEvents = result[2];
  return centre;
};

module.exports = {
  performReconciliation: (centre, visibilityRange, eventSearchDateRangeFactory, movementSearchDateRangeFactory, checkOutSearchDateRangeFactory) => {
    const rangeOfEvents = fullRange(visibilityRange, eventSearchDateRangeFactory);
    const rangeOfMovements = fullRange(visibilityRange, movementSearchDateRangeFactory);
    const reconciler = getReconciliationTester(movementSearchDateRangeFactory, eventSearchDateRangeFactory);
    const reinstatementReconciler = getReinstatementTester(checkOutSearchDateRangeFactory);

    centre.unreconciledEvents = [];
    centre.unreconciledMovements = [];
    centre.unreconciledReinstatements = [];
    centre.reconciled = [];
    centre.reinstatements = [];

    return populateEvents(centre, rangeOfEvents)
      .then(() => populateMovements(centre, rangeOfMovements))
      .then(() => handleReinstatements(centre, reinstatementReconciler))
      .then(() => reconcileEvents(centre, reconciler))
      .then(() => filterUnreconciled(centre, visibilityRange))
      .return(centre);
  },
  performConfiguredReconciliation: function (centre) {
    const visibilityRange = new DateRange(moment().subtract(2, 'days').toDate(), moment().toDate());
    const eventsFromMovementDateRangeFactory = (date) => new DateRange(
      moment(date).startOf('day').toDate(),
      moment(date).add(2, 'days').endOf('day').toDate()
    );
    const movementsFromEventDateRangeFactory = (date) => new DateRange(
      moment(date).subtract(2, 'days').startOf('day').toDate(),
      moment(date).endOf('day').toDate()
    );
    const checkOutFromReinstatementDateRangeFactory = (date) => new DateRange(
      moment(date).subtract(1, 'days').toDate(),
      moment(date).toDate()
    );
    return this.performReconciliation(
      centre,
      visibilityRange,
      eventsFromMovementDateRangeFactory,
      movementsFromEventDateRangeFactory,
      checkOutFromReinstatementDateRangeFactory
    );
  }
};
