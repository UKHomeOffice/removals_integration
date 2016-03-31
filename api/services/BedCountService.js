/* global Centres BedCountService doSomethingWithASummary */
'use strict';

module.exports = {
  calculateCentreState: function (centre, visibilityScope, eventReconciliationScopeFactory, movementReconciliationScopeFactory) {
    var debugEnabled = 0;
    var debugThis = function () {
      debugEnabled && console.log.apply(null, ['RECONCILIATION DEBUG:'].concat(arguments));
    };
    const visibleRange = { '>=': visibilityScope.from, '<=': visibilityScope.to };
    debugThis('Starting Reconciliation for centre', centre.id, centre.name);
    debugThis('Visibility', visibleRange);
    return Centres.findOne({ name: centre.name })
      .populate('events', { timestamp: visibleRange })
      .populate('movements', { timestamp: visibleRange })
      .then((centre) => this.populateEventDetainees(centre))
      .then((centre) => {
        debugThis('Centre', centre.id, centre.name, 'has', centre.movements.length, 'movements and', centre.events.length, 'events in this visibility range');
        var unreconciledMovements = [];
        var unreconciledEvents = [];
        var reconciled = [];
        var isReconciledMovement = (movement) => {
          var result = movement && reconciled.some((reconciliation) => {
              return movement.id === reconciliation.movement.id;
            });
          result && debugThis('✔', 'Skipping Reconciliation of Movement', movement.id, 'because it was already reconciled');
          return result;
        };
        var isReconciledEvent = (event) => {
          var result = event && reconciled.some((reconciliation) => {
              return event.id === reconciliation.event.id;
            });
          result && debugThis('✔', 'Skipping Reconciliation of Event', event.id, 'because it was already reconciled');
          return result;
        };
        var not = function (fn) {
          return function () {
            return !fn.apply(null, arguments || []);
          }
        }
        var dateSort = function (a, b) {
          return (a.timestamp > b.timestamp) - (a.timestamp < b.timestamp);
        }

        var promiseChain = Promise.all(centre.movements.filter(not(isReconciledMovement)).sort(dateSort).map(function (movement) {
          var reconciliationScope = movementReconciliationScopeFactory(movement.timestamp);
          var detaineeQuery = { centre: movement.centre, cid_id: movement.cid_id };
          var eventQuery = {
            where: {
              operation: movement.direction === 'in' ? ['check in', 'reinstatement'] : ['check out'],
              timestamp: { '>=': reconciliationScope.from, '<=': reconciliationScope.to }
            },
            sort: 'timestamp ASC'
          };
          return Detainee.findOne(detaineeQuery)
            .populate('events', eventQuery)
            .then((detainee) => {
              debugThis('Beginning Reconciliation of movement', movement.id, movement.direction, movement.timestamp, 'cid', movement.cid_id);
              detainee ? debugThis('|', 'Found Detainee', detainee.id, 'with query', JSON.stringify(detaineeQuery).replace(/(\r\n|\n|\r)/gm, "")) : debugThis('|', 'No matching detainee found with query', JSON.stringify(detaineeQuery).replace(/(\r\n|\n|\r)/gm, ""));
              detainee && debugThis('|', 'Found', detainee.events.length, 'matching events with query', JSON.stringify(eventQuery).replace(/(\r\n|\n|\r)/gm, ""));
              if (detainee && detainee.events.length) {
                var events = detainee.events.filter((event) => {
                  var isReconciled = reconciled.some((reconciliation) => {
                    return event.id === reconciliation.event.id;
                  });
                  isReconciled && debugThis('|', 'Skipping reconciled event', event.id);
                  return !isReconciled;
                });
                var event = events[0];
                if (event) {
                  event.detainee = Object.assign({}, detainee, { events: [] });
                  debugThis('✔', 'Reconciling movement', movement.id, movement.direction, movement.timestamp, 'cid', movement.cid_id, 'with event', event.id, event.operation, event.timestamp, 'cid', detainee.cid_id);
                  reconciled.push({ event, movement });
                  return true;
                }
              }
              debugThis('✗', 'Could not reconcile movement', movement.id, movement.direction, movement.timestamp, 'cid', movement.cid_id);
              unreconciledMovements.push(movement);
            });
        })).then(() => {
          return Promise.all(centre.events.filter(not(isReconciledEvent)).sort(dateSort).map(function (event) {
            var reconciliationScope = eventReconciliationScopeFactory(event.timestamp);
            var query = {
              where: {
                centre: event.centre,
                cid_id: event.detainee.cid_id,
                direction: ['check in', 'reinstatement'].indexOf(event.operation) > -1 ? 'in' : 'out',
                timestamp: { '>=': reconciliationScope.from, '<=': reconciliationScope.to }
              },
              sort: 'timestamp ASC'
            };
            return Movement.find(query)
              .then((movements) => {
                debugThis('Beginning reconciliaton of event', event.id, event.operation, event.timestamp, 'cid', event.detainee.cid_id);
                debugThis('|', 'Queried movements on ', JSON.stringify(query).replace(/(\r\n|\n|\r)/gm, ""));
                movements ? debugThis('|', 'Found', movements.length, 'matching movements') : debugThis('|', 'No matching movements found');
                if (movements && movements.length) {
                  movements = movements.filter((movement) => {
                    var isReconciled = reconciled.some((reconciliation) => {
                      return movement.id === reconciliation.movement.id;
                    });
                    isReconciled && debugThis('|', 'Skipping reconciled movement', movement.id);
                    return !isReconciled;
                  });
                  var movement = movements[0];
                  if (movement) {
                    debugThis('✔', 'Reconciling event', event.id, event.operation, event.timestamp, 'cid', event.detainee.cid_id, 'with movement', movement.id, movement.direction, movement.timestamp, 'cid', movement.cid_id);
                    reconciled.push({ event, movement });
                    return true;
                  }
                }
                debugThis('✗', 'Could not reconcile event', event.id, event.operation, event.timestamp, 'cid', event.detainee.cid_id);
                unreconciledEvents.push(event);
              });
          }));
        });

        return promiseChain
          .then(() => {
            var result = { unreconciledMovements, unreconciledEvents, reconciled };
            debugThis('Reconciliation completed', result);
            return result;
          });
      });
  },
  populateEventDetainees: function (centre) {
    return new Promise((resolve) => {
      Promise.all(centre.events.map((event, eventKey) => {
        return Detainee.findOne({ id: event.detainee })
          .then((detainee) => {
            centre.events[eventKey].detainee = detainee;
          });
      })).then(() => resolve(centre));
    });
  }
}
;
