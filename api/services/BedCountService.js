/* global Event Movement */
'use strict';

var DateRange = require('../lib/DateRange');
var moment = require('moment');

// const fullRange = (visibilityRange, rangeFactory) =>
//   new DateRange(rangeFactory(visibilityRange.from).from, rangeFactory(visibilityRange.to).to);

const fullRange = (visibilityRange, rangeFactory) =>
  DateRange.widen.apply(null, [visibilityRange, rangeFactory(visibilityRange.from), rangeFactory(visibilityRange.to)]);

let populate = (barrel, centreId, range) =>
  barrel.find({
    where: {
      centre: centreId,
      timestamp: { '>=': range.from, '<=': range.to }
    },
    sort: 'timestamp'
  });

const populateEvents = (centre, range) =>
  populate(Event, centre.id, range)
    .populate('detainee')
    .then(events => centre.unreconciledEvents = events);

const populateMovements = (centre, range) =>
  populate(Movement, centre.id, range)
    .then(movements => centre.unreconciledMovements = movements);

let reconcile = (eventKey, movementKey, centre, reconciler) => {
  const event = centre.unreconciledEvents[eventKey];
  const movement = centre.unreconciledMovements[movementKey];
  if (reconciler(event, movement)) {
    centre.reconciled.push({ event, movement });
    delete centre.unreconciledEvents[eventKey];
    delete centre.unreconciledMovements[movementKey];
    return true;
  }
  return false;
};

const reconcileEvents = (centre, reconciler) => {
  centre.unreconciledEvents.forEach((event, eventKey) =>
    centre.unreconciledMovements.some((movement, movementKey) => {
      return reconcile(eventKey, movementKey, centre, reconciler);
    })
  );
  centre.unreconciledMovements = centre.unreconciledMovements.filter((movement) => movement !== null);
  centre.unreconciledEvents = centre.unreconciledEvents.filter((event) => event !== null);
};

const resolveEventOperationWithMovementDirection = (eventType) => {
  switch (eventType) {
  case 'check in':
    return 'in';
  case 'check out':
    return 'out';
  default:
    return 'unknown';
  }
};

const reconciliationTester = (movementsRangeFactory, eventsRangeFactory) => (event, movement) => {
  const cidMatches = movement.cid_id === event.detainee.cid_id;
  const directionMatches = resolveEventOperationWithMovementDirection(event.operation) === movement.direction;
  const timestampMatches = movementsRangeFactory(event.timestamp).contains(movement.timestamp) || eventsRangeFactory(movement.timestamp).contains(event.timestamp);

  // console.log(cidMatches, directionMatches, timestampMatches);

  return cidMatches && directionMatches && timestampMatches;
};

const filterUnreconciled = (centre, range) => {
  centre.unreconciledEvents = centre.unreconciledEvents.filter(event => range.contains(event.timestamp));
  centre.unreconciledMovements = centre.unreconciledMovements.filter(movement => range.contains(movement.timestamp));
};

module.exports = {
  performReconciliation: (centre, visibilityRange, eventSearchDateRangeFactory, movementSearchDateRangeFactory) => {
    const rangeOfEvents = fullRange(visibilityRange, eventSearchDateRangeFactory);
    const rangeOfMovements = fullRange(visibilityRange, movementSearchDateRangeFactory);
    const reconciler = reconciliationTester(movementSearchDateRangeFactory, eventSearchDateRangeFactory);
    // const reinstatementReconciler = reinstatementTester(reinstatementCheckoutSearchDateRangeFactory);

    centre.unreconciledEvents = [];
    centre.unreconciledMovements = [];
    centre.reconciled = [];
    // centre.reinstatements = [];

    return populateEvents(centre, rangeOfEvents)
      .then(() => populateMovements(centre, rangeOfMovements))
      // .then(() => handleReinstatements(centre, reinstatementReconciler))
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

    return this.performReconciliation(centre, visibilityRange, eventsFromMovementDateRangeFactory, movementsFromEventDateRangeFactory);
  }
};
