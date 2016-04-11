/* global Centres Detainee Movement BedCountService doSomethingWithASummary */
'use strict';

var DateRange = require('../lib/DateRange');

const fullRange = (visibilityRange, rangeFactory) =>
  new DateRange(rangeFactory(visibilityRange.from).from, rangeFactory(visibilityRange.to).to);

const populate = (barrel, centreId, range) =>
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
const populateMovements = (centre, range) => () =>
  populate(Movement, centre.id, range)
    .then(movements => centre.unreconciledMovements = movements);

const reconcileEvents = (centre, reconciler) => () => {
  centre.unreconciledEvents = centre.unreconciledEvents.filter((event) =>
    !centre.unreconciledMovements.some((movement, movementKey) =>
      reconcile(movement, movementKey, centre, event, reconciler))
  );
  centre.unreconciledMovements = centre.unreconciledMovements.filter((movement) => movement !== null);
};
const reconcile = (movement, movementKey, centre, event, reconciler) => {
  if (reconciler(event, movement)) {
    centre.reconciled.push({ event, movement });
    delete centre.unreconciledMovements[movementKey];
    return true;
  }
  return false;
};
const reconciliationTester = (movementsRangeFactory, eventsRangeFactory) => (event, movement) =>
  movement.cid_id === event.detainee.cid_id && (movementsRangeFactory(event.timestamp).contains(movement.timestamp)
    || eventsRangeFactory(movement.timestamp).contains(event.timestamp));

const filterUnreconciled = (centre, range) => () => {
  centre.unreconciledEvents = centre.unreconciledEvents.filter(event => range.contains(event.timestamp));
  centre.unreconciledMovements = centre.unreconciledMovements.filter(movement => range.contains(movement.timestamp));
};

module.exports = {
  DateRange,

  calculateCentreState: (centre, visibilityRange, movementsRangeFactory, eventsRangeFactory) => {
    const rangeOfMovements = fullRange(visibilityRange, movementsRangeFactory);
    const rangeOfEvents = fullRange(visibilityRange, eventsRangeFactory);
    const reconciler = reconciliationTester(movementsRangeFactory, eventsRangeFactory);

    centre.unreconciledEvents = [];
    centre.unreconciledMovements = [];
    centre.reconciled = [];

    return populateEvents(centre, rangeOfEvents)
      .tap(populateMovements(centre, rangeOfMovements))
      .tap(reconcileEvents(centre, reconciler))
      .tap(filterUnreconciled(centre, visibilityRange))
      .return(centre);
  }
};
