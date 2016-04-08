/* global Centres Detainee Movement BedCountService doSomethingWithASummary */
'use strict';

function DateRange(from, to) {
  this.contains = function (date) {
    return date >= this.from && date <= this.to
  };

  this.from = from;
  this.to = to;
};

DateRange.widen = function () {
  var args = Array.prototype.slice.call(arguments);
  var from = args.map((range) => range.from);
  var resultingFrom = from.reduce((a, b) => a < b ? a : b);

  var to = args.map((range) => range.to);
  var resultingTo = to.reduce((a, b) => a > b ? a : b);

  return new DateRange(resultingFrom, resultingTo);
};

module.exports = {
  DateRange,

  calculateCentreState: function (centre, visibilityRange, movementsFromEventRangeFactory, eventsFromMovementRangeFactory) {
    var rangeOfMovements = DateRange.widen.apply([visibilityRange],
      [visibilityRange.from, visibilityRange.to].map((date) => movementsFromEventRangeFactory(date))
    );
    var rangeOfEvents = DateRange.widen.apply([visibilityRange],
      [visibilityRange.from, visibilityRange.to].map((date) => eventsFromMovementRangeFactory(date))
    );

    return new Promise((resolve) => {
      centre.unreconciledEvents = [];
      centre.unreconciledMovements = [];
      centre.reconciled = [];
      resolve(centre)
    })
      .then(this.populateEvents(rangeOfEvents))
      .then(this.populateMovements(rangeOfMovements))
      .then(this.reconcileEvents(this.getReconciliationTester(movementsFromEventRangeFactory, eventsFromMovementRangeFactory)))
      .then(this.filterUnreconciled(visibilityRange))
      .then(this.filterReconciled(visibilityRange))
      .then((centre) => {
        return centre;
      });
  },
  filterUnreconciled: (range) =>
    (centre) => {
      centre.unreconciledEvents = centre.unreconciledEvents.filter(event => range.contains(event.timestamp));
      centre.unreconciledMovements = centre.unreconciledMovements.filter(movement => range.contains(movement.timestamp));
      return centre;
    },
  filterReconciled: (range) =>
    (centre) => {
      centre.reconciled = centre.reconciled.filter(reconciled =>
        range.contains(reconciled.event.timestamp)
        || range.contains(reconciled.movement.timestamp)
      );
      return centre;
    },
  reconcileEvents: function (reconiciliationTester) {
    return (centre) => {
      centre.unreconciledEvents = centre.unreconciledEvents.filter((event) => {
        return !centre.unreconciledMovements.some(this.reconcile(centre, event, reconiciliationTester));
      });
      centre.unreconciledMovements = centre.unreconciledMovements.filter((movement) => movement !== null);
      return centre;
    };
  },
  reconcile: (centre, event, reconciler) =>
    (movement, movementKey) => {
      if (reconciler(event, movement)) {
        centre.reconciled.push({
          event,
          movement
        });
        delete centre.unreconciledMovements[movementKey];
        return true;
      }
      return false;
    },

  getReconciliationTester: (movementsFromEventRangeFactory, eventsFromMovementRangeFactory) =>
    (event, movement) => {
      return movement.cid_id === event.detainee.cid_id
        && (movementsFromEventRangeFactory(event.timestamp).contains(movement.timestamp) || eventsFromMovementRangeFactory(movement.timestamp).contains(event.timestamp))
    },
  populateEvents: (range) =>
    (centre) => Event.find({
        centre: centre.id,
        timestamp: {
          '>=': range.from,
          '<=': range.to
        }
      })
      .populate('detainee')
      .then((events) => {
        centre.unreconciledEvents = events;
        return centre;
      }),
  populateMovements: (range) =>
    (centre) => Movement.find({
        centre: centre.id,
        timestamp: {
          '>=': range.from,
          '<=': range.to
        }
      })
      .then((movements) => {
        centre.unreconciledMovements = movements;
        return centre;
      })
};
