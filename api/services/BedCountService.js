/* global Centres Detainee Movement BedCountService doSomethingWithASummary */
'use strict';

function DateRange(from, to) {
  this.contains = function (date) {
    return date >= this.from && date <= this.to
  };

  this.from = from;
  this.to = to;
}

DateRange.widen = function () {
  var args = Array.prototype.slice.call(arguments);
  var from = args.map((range) => range.from);
  var resultingFrom = from.reduce((a, b) => a < b ? a : b);

  var to = args.map((range) => range.to);
  var resultingTo = to.reduce((a, b) => a > b ? a : b);

  return new DateRange(resultingFrom, resultingTo);
};

const fullRange = (visibilityRange, rangeFactory) =>
  DateRange.widen.apply([visibilityRange], [visibilityRange.from, visibilityRange.to].map((date) => rangeFactory(date)));

const populate = (barrel, centreId, range) =>
  barrel.find({
    centre: centreId,
    timestamp: {
      '>=': range.from,
      '<=': range.to
    }
  });
const populateEvents = (centre, range) =>
  populate(Event, centre.id, range)
    .populate('detainee')
    .then(events => centre.unreconciledEvents = events);
const populateMovements = (centre, range) =>
  populate(Movement, centre.id, range)
    .then(movements => centre.unreconciledMovements = movements);

const reconcileEvents = (centre, reconciler) => {
  centre.unreconciledEvents = centre.unreconciledEvents.filter((event) =>
    !centre.unreconciledMovements.some((movement, movementKey) => reconcile(movement, movementKey, centre, event, reconciler))
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

const filterUnreconciled = (centre, range) => {
  centre.unreconciledEvents = centre.unreconciledEvents.filter(event => range.contains(event.timestamp));
  centre.unreconciledMovements = centre.unreconciledMovements.filter(movement => range.contains(movement.timestamp));
};
// const filterReconciled = (centre, range) => // FIXME: pretty sure we don't need to do this!!!
//   centre.reconciled = centre.reconciled.filter(reconciled =>
//     range.contains(reconciled.event.timestamp) || range.contains(reconciled.movement.timestamp)
//   );

module.exports = {
  DateRange,

  calculateCentreState: (centre, visibilityRange, movementsRangeFactory, eventsRangeFactory) => {
    const rangeOfMovements = fullRange(visibilityRange, movementsRangeFactory);
    const rangeOfEvents = fullRange(visibilityRange, eventsRangeFactory);
    const reconciler = reconciliationTester(movementsRangeFactory, eventsRangeFactory);

    centre.unreconciledEvents = [];
    centre.unreconciledMovements = [];
    centre.reconciled = [];

    return populateEvents(centre, rangeOfEvents).tap(() => populateMovements(centre, rangeOfMovements))
      .tap(() => reconcileEvents(centre, reconciler))
      .tap(() => filterUnreconciled(centre, visibilityRange))
      // .tap(() => filterReconciled(centre, visibilityRange)) // FIXME: pretty sure we don't need to do this!!!
      .return(centre);
  }
};
