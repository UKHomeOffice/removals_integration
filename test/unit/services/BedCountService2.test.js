/* global Centres BedcountService */
'use strict';

const days = (days) => 1000*60*60*24*days;
const dayAdjusted = (date, dayAdjust) => new Date(dayAdjust ? date.getTime() + days(dayAdjust) : date.getTime());
const startOfDay = (date, dayAdjust) => {
  const start = dayAdjusted(date, dayAdjust);
  start.setHours(0);
  start.setMinutes(0);
  start.setSeconds(0);
  return start;
};
const endOfDay = (date, dayAdjust) => {
  const end = dayAdjusted(date, dayAdjust);
  end.setHours(23);
  end.setMinutes(59);
  end.setSeconds(59);
  return end;
};
function Scope(from, to) {
  this.from = from;
  this.to = to;
}

const vScopeFactory = (date) => new Scope(startOfDay(date, -2), endOfDay(date));
const erScopeFactory = (date) => new Scope(startOfDay(date, -2), endOfDay(date));
const mrScopeFactory = (date) => new Scope(startOfDay(date), endOfDay(date, 2));

const test = (data, date, checks) => Centres.create(data.centres)
  .then(() => Movement.create(data.movements))
  .then(() => Detainee.create(data.detainees))
  .then(() => Event.create(data.events))
  .then(() => Centres.findOne({ name: 'BedCountServiceTestCentre' }))
  .then((centre) => BedCountService.calculateCentreState(centre, vScopeFactory(date), erScopeFactory, mrScopeFactory))
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
            "centre": { id: 1 },
            "gender": "male",
            "cid_id": 12345,
            "active": true,
            "direction": "in",
            "timestamp": new Date('01/01/2016')
          },
          {
            "id": 2,
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

    it('should flag an event without a movement', () => {
      var data = {
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
          }
        ]
      };

     return test(data, new Date('01/03/2016'), (result) => {
        expect(result.reconciled).to.have.length(0);
        expect(result.unreconciledEvents).to.have.length(1);
        expect(result.unreconciledMovements).to.have.length(0);
      });
    });

    it('should flag an movement without an event', () => {
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
        events: [ ]
      };

     return test(data, new Date('01/03/2016'), (result) => {
        expect(result.reconciled).to.have.length(0);
        expect(result.unreconciledEvents).to.have.length(0);
        expect(result.unreconciledMovements).to.have.length(1);
      });
    });

    it('should flag an movement without an event', () => {
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
            "timestamp": new Date('01/02/2016')
          }
        ]
      };

      return test(data, new Date('01/03/2016'), (result) => {
        expect(result.reconciled).to.have.length(1);
        expect(result.unreconciledEvents).to.have.length(0);
        expect(result.unreconciledMovements).to.have.length(0);
      });
    });
  });
});
