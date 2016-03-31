/* global Centres BedcountService */
'use strict';

describe.only('BedCountService', () => {
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
      return Centres.create(data.centres)
        .then(() => Movement.create(data.movements))
        .then(() => Detainee.create(data.detainees))
        .then(() => Event.create(data.events))
        .then(() => {
          return Centres.findOne({ name: 'BedCountServiceTestCentre' })
            .then((centre) => {
              var days = (days) => 1000*60*60*24*days;
              
              var vScopeFactory = (date) => {
                var fromDate, toDate;
                
                fromDate = new Date(date.getTime() - days(2));
                fromDate.setHours(0);
                fromDate.setMinutes(0);
                fromDate.setSeconds(0);
                
                toDate = new Date(date.getTime());
                toDate.setHours(23);
                toDate.setMinutes(59);
                toDate.setSeconds(59);
                return {
                  from: fromDate,
                  to: toDate
                }
              };
              
              var erScopeFactory = (date) => {
                var fromDate, toDate;
                
                fromDate = new Date(date.getTime() - days(2));
                fromDate.setHours(0);
                fromDate.setMinutes(0);
                fromDate.setSeconds(0);
                
                toDate = new Date(date.getTime());
                toDate.setHours(23);
                toDate.setMinutes(59);
                toDate.setSeconds(59);
                
                return {
                  from: fromDate,
                    to: toDate
                };
              };
 
              var mrScopeFactory = (date) => {
                var fromDate, toDate;
                
                fromDate = new Date(date.getTime());
                fromDate.setHours(0);
                fromDate.setMinutes(0);
                fromDate.setSeconds(0);
                
                toDate = new Date(date.getTime() + days(2));
                toDate.setHours(23);
                toDate.setMinutes(59);
                toDate.setSeconds(59);
                
                return {
                  from: fromDate,
                    to: toDate
                };
              };
              var visibilityScope = vScopeFactory(new Date('01/03/2016'));
              return BedCountService.calculateCentreState(centre, visibilityScope, erScopeFactory, mrScopeFactory);
            }).then((result) => {
              expect(result.reconciled).to.have.length(1);
              expect(result.unreconciledEvents).to.have.length(1);
              expect(result.unreconciledMovements).to.have.length(1);
            })
        });
    });
  });
});
