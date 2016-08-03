/* global Centres BedcountService */
'use strict';

const moment = require('moment');
const DateRange = require('../../../api/lib/DateRange');

const vDateRangeFactory = (date) => new DateRange(
  moment(date).subtract(2, 'days').startOf('day').toDate(),
  moment(date).endOf('day').toDate()
);
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
const test = (data, date, checks) => Centres.destroy()
  .then(() => Movement.destroy())
  .then(() => Detainee.destroy())
  .then(() => Event.destroy())
  .then(() => Centres.create(data.centres))
  .then(() => Movement.create(data.movements))
  .then(() => Detainee.create(data.detainees))
  .then(() => Event.create(data.events))
  .then(() => Centres.findOne({ name: 'BedCountServiceTestCentre' }))
  .then((centre) => BedCountService.performReconciliation(centre, vDateRangeFactory(date), eventsFromMovementDateRangeFactory, movementsFromEventDateRangeFactory, checkOutFromReinstatementDateRangeFactory))
  .then(checks);

describe('BedCountService', () => {

  describe('getSummary', () => {

    it('new calc', () => {
      var data = {
        centres: [
          {
            id: 1,
            name: 'BedCountServiceTestCentre'
          }
        ],
        movements: [
          {
            "id": 1,
            "mo_ref": 1,
            "centre": { id: 1 },
            "gender": "male",
            "cid_id": 12345,
            "active": true,
            "direction": "in",
            "timestamp": new Date('01/01/2016')
          },
          {
            "id": 2,
            "mo_ref": 2,
            "centre": { id: 1 },
            "gender": "male",
            "cid_id": 123415,
            "active": true,
            "direction": "in",
            "timestamp": new Date('01/01/2016')
          }
        ],
        detainees: [
          {
            "id": 1,
            "centre": { id: 1 },
            "cid_id": 12345,
            "person_id": 222222,
            "gender": "male",
            "nationality": "swe",
            "timestamp": new Date('01/01/2016')
          }
        ],
        events: [
          {
            "id": 1,
            "centre": { id: 1 },
            "detainee": 1,
            "operation": "check in",
            "timestamp": new Date('01/02/2016')
          },
          {
            "id": 2,
            "centre": { id: 1 },
            "detainee": 1,
            "operation": "check in",
            "timestamp": new Date('01/02/2016')
          }
        ]
      };

      return test(data, new Date('01/03/2016'), (result) => {
        expect(result.reconciled).to.have.length(1);
        expect(result.unreconciledEvents).to.have.length(1);
        expect(result.unreconciledMovements).to.have.length(1);
      });
    });

    it('should not see movements and events outside of the visible scope', () => {
      var data = {
        centres: [
          {
            id: 1,
            name: 'BedCountServiceTestCentre'
          }
        ],
        movements: [
          {
            "id": 1,
            "mo_ref": 1,
            "centre": { id: 1 },
            "gender": "male",
            "cid_id": 12345,
            "active": true,
            "direction": "in",
            "timestamp": new Date('01/05/2016')
          }
        ],
        detainees: [
          {
            "id": 1,
            "centre": { id: 1 },
            "cid_id": 12345,
            "person_id": 222222,
            "gender": "male",
            "nationality": "swe",
            "timestamp": new Date('01/01/2016')
          }
        ],
        events: [
          {
            "id": 1,
            "centre": { id: 1 },
            "detainee": 1,
            "operation": "check in",
            "timestamp": new Date('01/01/2016')
          }
        ]
      };

      return test(data, new Date('01/04/2016'), (result) => {
        expect(result.reconciled).to.have.length(0);
        expect(result.unreconciledEvents).to.have.length(0);
        expect(result.unreconciledMovements).to.have.length(0);
      });
    });

    it('should reconcile reinstatements when checkout falls within reinstatement date range', () => {
      const data = {
        centres: [
          {
            id: 1,
            name: 'BedCountServiceTestCentre'
          }
        ],
        movements: [ ],
        detainees: [
          {
            "id": 1,
            "centre": { id: 1 },
            "cid_id": 12345,
            "person_id": 222222,
            "gender": "male",
            "nationality": "swe",
            "timestamp": new Date('01/02/2016')
          }
        ],
        events: [
          {
            "id": 1,
            "centre": { id: 1 },
            "detainee": 1,
            "operation": "check out",
            "timestamp": new Date('01/03/2016')
          },
          {
            "id": 2,
            "centre": { id: 1 },
            "detainee": 1,
            "operation": "reinstatement",
            "timestamp": new Date('01/03/2016')
          }
        ]
      };

      return test(data, new Date('01/04/2016'), (result) => {
        expect(result.reinstatements).to.have.length(1);
        expect(result.unreconciledEvents).to.have.length(0);
        expect(result.unreconciledMovements).to.have.length(0);
      });
    });
    it('should not reconcile reinstatements when checkout falls outside reinstatement date range', () => {
      const data = {
        centres: [
          {
            id: 1,
            name: 'BedCountServiceTestCentre'
          }
        ],
        movements: [ ],
        detainees: [
          {
            "id": 1,
            "centre": { id: 1 },
            "cid_id": 12345,
            "person_id": 222222,
            "gender": "male",
            "nationality": "swe",
            "timestamp": new Date('01/02/2016')
          }
        ],
        events: [
          {
            "id": 1,
            "centre": { id: 1 },
            "detainee": 1,
            "operation": "check out",
            "timestamp": new Date('01/03/2016')
          },
          {
            "id": 2,
            "centre": { id: 1 },
            "detainee": 1,
            "operation": "reinstatement",
            "timestamp": new Date('01/05/2016')
          }
        ]
      };

      return test(data, new Date('01/04/2016'), (result) => {
        expect(result.reinstatements).to.have.length(0);
        expect(result.unreconciledEvents).to.have.length(1);
        expect(result.unreconciledMovements).to.have.length(0);
      });
    })
    it('should reconcile a visible movement with an event which falls inside the movement reconciliation scope', () => {
      const data = {
        centres: [
          {
            id: 1,
            name: 'BedCountServiceTestCentre'
          }
        ],
        movements: [
          {
            "id": 1,
            "mo_ref": 1,
            "centre": { id: 1 },
            "gender": "male",
            "cid_id": 12345,
            "active": true,
            "direction": "in",
            "timestamp": new Date('01/01/2016')
          }
        ],
        detainees: [
          {
            "id": 1,
            "centre": { id: 1 },
            "cid_id": 12345,
            "person_id": 222222,
            "gender": "male",
            "nationality": "swe",
            "timestamp": new Date('01/02/2016')
          }
        ],
        events: [
          {
            "id": 1,
            "centre": { id: 1 },
            "detainee": 1,
            "operation": "check in",
            "timestamp": new Date('01/03/2016')
          }
        ]
      };

      return test(data, new Date('01/02/2016'), (result) => {
        expect(result.reconciled).to.have.length(1);
        expect(result.unreconciledEvents).to.have.length(0);
        expect(result.unreconciledMovements).to.have.length(0);
      });
    });

    it('should not reconcile a visible movement with an event which falls before the movement reconciliation scope', () => {
      const data = {
        centres: [
          {
            id: 1,
            name: 'BedCountServiceTestCentre'
          }
        ],
        movements: [
          {
            "id": 1,
            "mo_ref": 1,
            "centre": { id: 1 },
            "gender": "male",
            "cid_id": 12345,
            "active": true,
            "direction": "in",
            "timestamp": new Date('01/02/2016')
          }
        ],
        detainees: [
          {
            "id": 1,
            "centre": { id: 1 },
            "cid_id": 12345,
            "person_id": 222222,
            "gender": "male",
            "nationality": "swe",
            "timestamp": new Date('01/01/2016')
          }
        ],
        events: [
          {
            "id": 1,
            "centre": { id: 1 },
            "detainee": 1,
            "operation": "check in",
            "timestamp": new Date('01/01/2016')
          }
        ]
      };

      return test(data, new Date('01/04/2016'), (result) => {
        expect(result.reconciled).to.have.length(0);
        expect(result.unreconciledEvents).to.have.length(0);
        expect(result.unreconciledMovements).to.have.length(1);
      });
    });

    it('should not reconcile a visible movement with an event which falls after of the movement reconciliation scope', () => {
      const data = {
        centres: [
          {
            id: 1,
            name: 'BedCountServiceTestCentre'
          }
        ],
        movements: [
          {
            "id": 1,
            "mo_ref": 1,
            "centre": { id: 1 },
            "gender": "male",
            "cid_id": 12345,
            "active": true,
            "direction": "in",
            "timestamp": new Date('01/02/2016')
          }
        ],
        detainees: [
          {
            "id": 1,
            "centre": { id: 1 },
            "cid_id": 12345,
            "person_id": 222222,
            "gender": "male",
            "nationality": "swe",
            "timestamp": new Date('01/02/2016')
          }
        ],
        events: [
          {
            "id": 1,
            "centre": { id: 1 },
            "detainee": 1,
            "operation": "check in",
            "timestamp": new Date('01/05/2016')
          }
        ]
      };

      return test(data, new Date('01/03/2016'), (result) => {
        expect(result.reconciled).to.have.length(0);
        expect(result.unreconciledEvents).to.have.length(0);
        expect(result.unreconciledMovements).to.have.length(1);
      });
    });

    it('should reconcile a visible event with a movement which falls inside the event reconciliation scope', () => {
      const data = {
        centres: [
          {
            id: 1,
            name: 'BedCountServiceTestCentre'
          }
        ],
        movements: [
          {
            "id": 1,
            "mo_ref": 1,
            "centre": { id: 1 },
            "gender": "male",
            "cid_id": 12345,
            "active": true,
            "direction": "in",
            "timestamp": new Date('01/02/2016')
          }
        ],
        detainees: [
          {
            "id": 1,
            "centre": { id: 1 },
            "cid_id": 12345,
            "person_id": 222222,
            "gender": "male",
            "nationality": "swe",
            "timestamp": new Date('01/02/2016')
          }
        ],
        events: [
          {
            "id": 1,
            "centre": { id: 1 },
            "detainee": 1,
            "operation": "check in",
            "timestamp": new Date('01/03/2016')
          }
        ]
      };

      return test(data, new Date('01/05/2016'), (result) => {
        expect(result.reconciled).to.have.length(1);
        expect(result.unreconciledEvents).to.have.length(0);
        expect(result.unreconciledMovements).to.have.length(0);
      });
    });

    it('should not reconcile a visible event with a movement which falls before the event reconciliation scope', () => {
      const data = {
        centres: [
          {
            id: 1,
            name: 'BedCountServiceTestCentre'
          }
        ],
        movements: [
          {
            "id": 1,
            "mo_ref": 1,
            "centre": { id: 1 },
            "gender": "male",
            "cid_id": 12345,
            "active": true,
            "direction": "in",
            "timestamp": new Date('01/01/2016')
          }
        ],
        detainees: [
          {
            "id": 1,
            "centre": { id: 1 },
            "cid_id": 12345,
            "person_id": 222222,
            "gender": "male",
            "nationality": "swe",
            "timestamp": new Date('01/01/2016')
          }
        ],
        events: [
          {
            "id": 1,
            "centre": { id: 1 },
            "detainee": 1,
            "operation": "check in",
            "timestamp": new Date('01/04/2016')
          }
        ]
      };

      return test(data, new Date('01/05/2016'), (result) => {
        expect(result.reconciled).to.have.length(0);
        expect(result.unreconciledEvents).to.have.length(1);
        expect(result.unreconciledMovements).to.have.length(0);
      });
    });

    it('should not reconcile a visible event with a movement which falls after of the event reconciliation scope', () => {
      const data = {
        centres: [
          {
            id: 1,
            name: 'BedCountServiceTestCentre'
          }
        ],
        movements: [
          {
            "id": 1,
            "mo_ref": 1,
            "centre": { id: 1 },
            "gender": "male",
            "cid_id": 12345,
            "active": true,
            "direction": "in",
            "timestamp": new Date('01/04/2016')
          }
        ],
        detainees: [
          {
            "id": 1,
            "centre": { id: 1 },
            "cid_id": 12345,
            "person_id": 222222,
            "gender": "male",
            "nationality": "swe",
            "timestamp": new Date('01/02/2016')
          }
        ],
        events: [
          {
            "id": 1,
            "centre": { id: 1 },
            "detainee": 1,
            "operation": "check in",
            "timestamp": new Date('01/03/2016')
          }
        ]
      };

      return test(data, new Date('01/03/2016'), (result) => {
        expect(result.reconciled).to.have.length(0);
        expect(result.unreconciledEvents).to.have.length(1);
        expect(result.unreconciledMovements).to.have.length(0);
      });
    });

    it('should resolve all of these as expected', () => {
      const data = {
        centres: [
          {
            id: 1,
            name: 'BedCountServiceTestCentre'
          }
        ],
        movements: [
          {
            "id": 50,
            "mo_ref": 50,
            "centre": { id: 1 },
            "gender": "male",
            "cid_id": 999111,
            "active": true,
            "direction": "in",
            "timestamp": new Date('01/04/2016') // Date doesn't fit with Event:50
          },
          {
            "id": 51,
            "mo_ref": 51,
            "centre": { id: 1 },
            "gender": "male",
            "cid_id": 999111,
            "active": true,
            "direction": "out",
            "timestamp": new Date('01/04/2016')
          },
          {
            "id": 52,
            "mo_ref": 52,
            "centre": { id: 1 },
            "gender": "male",
            "cid_id": 999111,
            "active": true,
            "direction": "in",
            "timestamp": new Date('01/05/2016')
          },
          {
            "id": 53,
            "mo_ref": 53,
            "centre": { id: 1 },
            "gender": "male",
            "cid_id": 11111, // No matching event for cid
            "active": true,
            "direction": "in",
            "timestamp": new Date('01/05/2016')
          },
          {
            "id": 54,
            "mo_ref": 54,
            "centre": { id: 1 },
            "gender": "male",
            "cid_id": 999111,
            "active": true,
            "direction": "in",
            "timestamp": new Date('01/06/2016') // future movement no matching event yet
          },
          {
            "id": 55,
            "mo_ref": 55,
            "centre": { id: 1 },
            "gender": "male",
            "cid_id": 999111,
            "active": true,
            "direction": "in",
            "timestamp": new Date('12/31/2015') // past movement no matching event in range
          },
          {
            "id": 56, // matches Event:54
            "mo_ref": 56,
            "centre": { id: 1 },
            "gender": "male",
            "cid_id": 777888,
            "active": true,
            "direction": "out",
            "timestamp": new Date('01/05/2016')
          },
          {
            "id": 57, // matches Event:55
            "mo_ref": 57,
            "centre": { id: 1 },
            "gender": "male",
            "cid_id": 999111,
            "active": true,
            "direction": "out",
            "timestamp": new Date('01/05/2016')
          },
          {
            "id": 58, // matches Event:56
            "mo_ref": 58,
            "centre": { id: 1 },
            "gender": "male",
            "cid_id": 999111,
            "active": true,
            "direction": "in",
            "timestamp": new Date('01/05/2016')
          }
        ],
        detainees: [
          {
            "id": 50,
            "centre": { id: 1 },
            "cid_id": 999111,
            "person_id": 222222,
            "gender": "male",
            "nationality": "swe",
            "timestamp": new Date('01/02/2016')
          },
          {
            "id": 51,
            "centre": { id: 1 },
            "cid_id": 777888,
            "person_id": 222222,
            "gender": "male",
            "nationality": "swe",
            "timestamp": new Date('01/01/2016')
          },
        ],
        events: [
          {
            "id": 50,
            "centre": { id: 1 },
            "detainee": 50,
            "operation": "check in",
            "timestamp": new Date('01/03/2016') // Date doesn't fit with Movement:50
          },
          {
            "id": 51,
            "centre": { id: 1 },
            "detainee": 50,
            "operation": "check out",
            "timestamp": new Date('01/04/2016')
          },
          {
            "id": 52,
            "centre": { id: 1 },
            "detainee": 50,
            "operation": "check in",
            "timestamp": new Date('01/05/2016')
          },
          {
            "id": 53,
            "centre": { id: 1 },
            "detainee": 51, // Doesn't match with any movement
            "operation": "check in",
            "timestamp": new Date('01/05/2016')
          },
          {
            "id": 54,
            "centre": { id: 1 },
            "detainee": 51,
            "operation": "check out",
            "timestamp": new Date('01/05/2016')
          },
          {
            "id": 99,
            "centre": { id: 1 },
            "detainee": 51,
            "operation": "reinstatement",
            "timestamp": new Date('01/05/2016')
          },
          {
            "id": 55,
            "centre": { id: 1 },
            "detainee": 50,
            "operation": "check out",
            "timestamp": new Date('01/05/2016')
          },
          {
            "id": 56,
            "centre": { id: 1 },
            "detainee": 50,
            "operation": "check in",
            "timestamp": new Date('01/05/2016')
          },
        ]
      };

      return test(data, new Date('01/05/2016'), (result) => {
        expect(result.reconciled).to.have.length(4);
        expect(result.reinstatements).to.have.length(1);
        expect(result.unreconciledMovements).to.have.length(3);
        expect(result.unreconciledEvents).to.have.length(2);
      });
    });

  });
});
