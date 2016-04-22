/* global Centres BedCountService */
'use strict';

var moment = require('moment');
var rewire = require('rewire');
var DateRange = require('../../../api/lib/DateRange');
var BedCountService = rewire('../../../api/services/BedCountService');

describe('UNIT BedCountService', () => {

  describe('helper function', () => {
    describe('#populate', () => {
      const populate = BedCountService.__get__('populate');

      it('should find all items from the specified centre only', () =>
        populate(Movement, 1, new DateRange(new Date('2000/01/01'), new Date('2100/01/01')))
          .then(movements => {
            expect(movements).to.have.length(4);
            return movements.every(movement =>
              expect(movement).to.have.property('centre', 1));
          })
      );

      it('should find all items from the specified date range only', () => {
        const start = new Date('2016/02/22'), end = new Date('2016/02/27');
        return populate(Movement, 1, new DateRange(start, end))
          .then(movements => {
            expect(movements).to.have.length(2);
            return movements.every(movement =>
              expect(movement).to.have.property('timestamp')
                .to.be.afterDate(start)
                .to.be.beforeDate(end)
            );
          });
      });
    });
    describe('#fullRange', () => {
      const fullRange = BedCountService.__get__('fullRange');
      it('should return the a range extended at either end by a range factory', () => {
        const range = new DateRange(new Date('2016/02/22'), new Date('2016/02/27'));
        const factoryReturn = {
          from: new Date('2016/02/20'),
          to: new Date('2016/02/29')
        };
        const rangeFactory = (date) => factoryReturn;
        const result = fullRange(range, rangeFactory);
        expect(result).to.have.property('to', factoryReturn.to);
        expect(result).to.have.property('from', factoryReturn.from);
      });

      it('should not shrink the range', () => {
        const range = new DateRange(new Date('2016/02/22'), new Date('2016/02/27'));
        const factoryReturn = {
          from: new Date('2016/02/25'),
          to: new Date('2016/02/26')
        };
        const rangeFactory = (date) => factoryReturn;
        const result = fullRange(range, rangeFactory);
        expect(result).to.have.property('to', range.to);
        expect(result).to.have.property('from', range.from);
      });
    });
    describe('#populateEvents', () => {
      const populateEvents = BedCountService.__get__('populateEvents');
      const originalPopulate = BedCountService.__get__('populate');

      it('should populate a centres unreconciledEvents', () => {
        const dummyEvents = [];
        const centre = {};
        const populateStubReturn = { populate: sinon.stub().resolves(dummyEvents) };
        BedCountService.__set__('populate', sinon.stub().returns(populateStubReturn));
        return populateEvents(centre, {}).then(() => {
          BedCountService.__set__('populate', originalPopulate);
          expect(centre.unreconciledEvents).to.equal(dummyEvents);
        });
      });
    });
    describe('#populateMovements', () => {
      const populateMovements = BedCountService.__get__('populateMovements');
      const originalPopulate = BedCountService.__get__('populate');

      it('should populate a centres unreconciledMovements', () => {
        const dummyMovements = [];
        const centre = {};
        const populateStubReturn = sinon.stub().resolves(dummyMovements);
        BedCountService.__set__('populate', populateStubReturn);
        return populateMovements(centre, {}).then(() => {
          BedCountService.__set__('populate', originalPopulate);
          expect(centre.unreconciledMovements).to.equal(dummyMovements);
        });
      });
    });
    describe('#reconciliationTester', () => {
      const reconciliationTester = BedCountService.__get__('reconciliationTester');
      it('should return a function', () => {
        expect(reconciliationTester()).to.be.a('function');
      });
      describe('returned function', () => {
        it('should return true when event & movement cid_id match and event timestamp is within the movement reconiciliation range', () => {
          const movementReconciliationRangeFactory = () => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const tester = reconciliationTester(() => new DateRange(), movementReconciliationRangeFactory);
          const event = { detainee: { cid_id: 1234 }, timestamp: new Date('2016/01/15'), operation: 'check in' };
          const movement = { cid_id: 1234, timestamp: new Date('2017/01/01'), direction: 'in' };
          expect(tester(event, movement)).to.equal(true);
        });
        it('should return true when event & movement cid_id match and movement timestamp is within the event reconiciliation range', () => {
          const eventReconciliationRangeFactory = () => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const tester = reconciliationTester(eventReconciliationRangeFactory, () => new DateRange());
          const event = { detainee: { cid_id: 1234 }, timestamp: new Date('2017/01/15'), operation: 'check in' };
          const movement = { cid_id: 1234, timestamp: new Date('2016/01/01'), direction: 'in' };
          expect(tester(event, movement)).to.equal(true);
        });
        it('should return true when event & movement cid_id match and movement timestamp is within the event reconiciliation range and the event timestamp is within the movement reconciliation range', () => {
          const eventReconciliationRangeFactory = () => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const movementReconciliationRangeFactory = () => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const tester = reconciliationTester(eventReconciliationRangeFactory, movementReconciliationRangeFactory);
          const event = { detainee: { cid_id: 1234 }, timestamp: new Date('2016/01/15'), operation: 'check in' };
          const movement = { cid_id: 1234, timestamp: new Date('2016/01/01'), direction: 'in' };
          expect(tester(event, movement)).to.equal(true);
        });
        it('should return false when event type does not resolve with the movement direction', () => {
          const eventReconciliationRangeFactory = () => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const movementReconciliationRangeFactory = () => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const tester = reconciliationTester(eventReconciliationRangeFactory, movementReconciliationRangeFactory);
          const event = { detainee: { cid_id: 1234 }, timestamp: new Date('2016/01/15'), operation: 'check in' };
          const movement = { cid_id: 1234, timestamp: new Date('2016/01/01'), direction: 'out' };
          expect(tester(event, movement)).to.equal(false);
        });
        it('should return false when event & movement cid_id do not match', () => {
          const eventReconciliationRangeFactory = () => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const movementReconciliationRangeFactory = () => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const tester = reconciliationTester(eventReconciliationRangeFactory, movementReconciliationRangeFactory);
          const event = { detainee: { cid_id: 1111 }, timestamp: new Date('2016/01/15'), operation: 'check in' };
          const movement = { cid_id: 2222, timestamp: new Date('2016/01/01'), direction: 'in' };
          expect(tester(event, movement)).to.equal(false);
        });
        it('should return false when movement timestamp isnt within the event reconiciliation range and the event timestamp isnt within the movement reconciliation range', () => {
          const eventReconciliationRangeFactory = () => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const movementReconciliationRangeFactory = () => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const tester = reconciliationTester(eventReconciliationRangeFactory, movementReconciliationRangeFactory);
          const event = { detainee: { cid_id: 1234 }, timestamp: new Date('2016/02/01'), operation: 'check in' };
          const movement = { cid_id: 1234, timestamp: new Date('2016/02/01'), direction: 'in' };
          expect(tester(event, movement)).to.equal(false);
        });
      });
    });
    describe('#filterUnreconciled', () => {
      const filterUnreconciled = BedCountService.__get__('filterUnreconciled');
      it('should remove unreconciledEvents and unreconciledMovments which arent within range', () => {
        const range = new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
        const centre = {
          unreconciledEvents: [
            {
              id: 'present',
              timestamp: new Date('2016/01/15')
            },
            {
              id: 'absent',
              timestamp: new Date('2016/02/15')
            },
            {
              id: 'absent',
              timestamp: new Date('2015/12/15')
            }
          ],
          unreconciledMovements: [
            {
              id: 'present',
              timestamp: new Date('2016/01/15')
            },
            {
              id: 'absent',
              timestamp: new Date('2016/02/15')
            },
            {
              id: 'absent',
              timestamp: new Date('2015/12/15')
            }
          ]
        };
        const expected = {
          unreconciledEvents: [
            {
              id: 'present',
              timestamp: new Date('2016/01/15')
            }
          ],
          unreconciledMovements: [
            {
              id: 'present',
              timestamp: new Date('2016/01/15')
            }
          ]
        };
        filterUnreconciled(centre, range);
        expect(centre).to.deep.equal(expected);
      });
    });
    describe('#resolveEventTypeWithDirection', () => {
      const resolveEventOperationWithMovementDirection = BedCountService.__get__('resolveEventOperationWithMovementDirection');
      it('should resolve correctly', () => {
        expect(resolveEventOperationWithMovementDirection('check in')).to.equal('in');
        expect(resolveEventOperationWithMovementDirection('check out')).to.equal('out');
        expect(resolveEventOperationWithMovementDirection('anUnknownEventType')).to.equal('unknown');
      });
    });
    describe('#reconcileEvents', () => {
      const reconcileEvents = BedCountService.__get__('reconcileEvents');
      const originalReconcile = BedCountService.__get__('reconcile');
      it('should call the reconcile for event*movement with the appropriate arguments until reconcile returns true', () => {
        const reconcileStub = sinon.stub();
        BedCountService.__set__('reconcile', reconcileStub);

        reconcileStub.returns(false);
        reconcileStub.onSecondCall().returns(true);
        const reconciler = {};
        const centre = {
          unreconciledEvents: [0, 1, 2],
          unreconciledMovements: [0, 1, 2]
        };
        reconcileEvents(centre, reconciler);
        expect(reconcileStub.calledWith(0, 0, centre, reconciler)).to.be.equal(true);
        expect(reconcileStub.calledWith(0, 1, centre, reconciler)).to.be.equal(true);
        // not called with 0, 2 because the reconciler returns true
        expect(reconcileStub.calledWith(0, 2, centre, reconciler)).to.be.equal(false);
        expect(reconcileStub.calledWith(1, 0, centre, reconciler)).to.be.equal(true);
        expect(reconcileStub.calledWith(1, 1, centre, reconciler)).to.be.equal(true);
        expect(reconcileStub.calledWith(1, 2, centre, reconciler)).to.be.equal(true);
        expect(reconcileStub.calledWith(2, 0, centre, reconciler)).to.be.equal(true);
        expect(reconcileStub.calledWith(2, 1, centre, reconciler)).to.be.equal(true);
        expect(reconcileStub.calledWith(2, 2, centre, reconciler)).to.be.equal(true);
        BedCountService.__set__('reconcile', originalReconcile);
      });
    });
    describe('#reconcile', () => {
      const reconcile = BedCountService.__get__('reconcile');
      it('should remove from unreconciled and move to reconciled if reconciler returns true', () => {
        const reconciler = () => true;
        const event = {
          id: 'reconciled'
        };
        const movement = {
          id: 'reconciled'
        };
        const centre = {
          reconciled: [],
          unreconciledEvents: [event],
          unreconciledMovements: [movement]
        };

        reconcile(0, 0, centre, reconciler);
        expect(centre.unreconciledEvents).to.not.include(event);
        expect(centre.unreconciledMovements).to.not.include(movement);
        expect(centre.reconciled[0].event).to.equal(event);
        expect(centre.reconciled[0].movement).to.equal(movement);
      });
    });
  });

  describe('calculateCentreState', () => {
    it('should return the centre', () => {
      const vDateRangeFactory = (date) => new DateRange(
        moment(date).subtract(2, 'days').startOf('day').toDate(),
        moment(date).endOf('day').toDate()
      );
      const movementSearchDateRangeFactory = (date) => new DateRange(
        moment(date).subtract(2, 'days').startOf('day').toDate(),
        moment(date).endOf('day').toDate()
      );
      const eventSearchDateRangeFactory = (date) => new DateRange(
        moment(date).startOf('day').toDate(),
        moment(date).add(2, 'days').endOf('day').toDate()
      );

      return Centres.findOne({ id: 1 })
        .then((centre) => {
          return BedCountService.performReconciliation(
            centre,
            vDateRangeFactory(new Date('01/01/2016')),
            eventSearchDateRangeFactory,
            movementSearchDateRangeFactory
          ).then((result) => {
            expect(result).to.be.equal(centre);
            expect(result).to.have.property('reconciled');
            expect(result).to.have.property('unreconciledEvents');
            expect(result).to.have.property('unreconciledMovements');
          });
        });
    });
  });
});
