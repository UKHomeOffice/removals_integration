/* global Centres BedCountService */
'use strict';

const moment = require('moment');
const rewire = require('rewire');
const DateRange = require('../../../api/lib/DateRange');
const BedCountService = rewire('../../../api/services/BedCountService');

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
        const dummyEvents = [{operation: Event.OPERATION_CHECK_IN}, {operation: Event.OPERATION_REINSTATEMENT}];
        const centre = {
          unreconciledEvents: [],
          unreconciledReinstatements: []
        };
        const populateStubReturn = {populate: sinon.stub().resolves(dummyEvents)};
        BedCountService.__set__('populate', sinon.stub().returns(populateStubReturn));
        return populateEvents(centre, {}).then(() => {
          BedCountService.__set__('populate', originalPopulate);
          expect(centre.unreconciledEvents).to.deep.equal([dummyEvents[0]]);
          expect(centre.unreconciledReinstatements).to.deep.equal([dummyEvents[1]]);
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

    describe('#populateOOC', () => {
      const populateOOC = BedCountService.__get__('populateOOC');
      var input = {centre: {id: 1}};
      var output = {
        centre: {
          id: 1
        },
        outOfCommission: {
          female: {
            'Crime Scene': 1,
            'Maintenance - Health and Safety Concern': 1,
            'Maintenance - Planned works': 1,
            'Medical Isolation': 1,
            'Other': 2
          },
          male: {
            'Maintenance - Malicious/Accidental Damage': 1,
            'Single Occupancy': 1,
          }
        }
      };
      var getOOCByCentreGroupByGenderAndReasonResponse = {
        male: {
          'Single Occupancy': 1,
          'Maintenance - Malicious/Accidental Damage': 1
        },
        female: {
          'Maintenance - Health and Safety Concern': 1,
          'Maintenance - Planned works': 1,
          'Crime Scene': 1,
          'Medical Isolation': 1,
          Other: 2
        }
      };

      before(() => sinon.stub(BedEvent, 'getOOCByCentreGroupByGenderAndReason').resolves(getOOCByCentreGroupByGenderAndReasonResponse));

      after(() => BedEvent.getOOCByCentreGroupByGenderAndReason.restore());

      it('should merge the response of BedEvent.getOOCByCentreGroupByGenderAndReason into the return', () =>
        expect(populateOOC(input)).to.eventually.deep.equal(output)
      );
    });

    describe('#populatePrebooking', () => {
      const populatePrebooking = BedCountService.__get__('populatePrebooking');
      var input = {centre: {id: 1}};
      var output = {
        centre: {
          id: 1
        },
        prebooking: {
          male: {
            details: {
              'Ops1': 1,
              'Ops2': 13
            },
            total: 14
          },
          female: {
            details: {
              'Ops3': 5,
              'Ops4': 7
            },
            total: 12
          }
        }
      };
      var getPrebookingByCentreGroupByGenderCidOrTaskForceResponse = {
        male: {
          details: {
            'Ops1': 1,
            'Ops2': 13
          },
          total: 14
        },
        female: {
          details: {
            'Ops3': 5,
            'Ops4': 7
          },
          total: 12
        }
      };

      before(() => sinon.stub(Prebooking, 'getPrebookingByCentreGroupByGenderCidOrTaskForce').resolves(getPrebookingByCentreGroupByGenderCidOrTaskForceResponse));

      after(() => Prebooking.getPrebookingByCentreGroupByGenderCidOrTaskForce.restore());

      it('should merge the response of Prebooking.getPrebookingByCentreGroupByGenderCidOrTaskForce into the return', () =>
        expect(populatePrebooking(input)).to.eventually.deep.equal(output)
      );
    });

    describe('#populateContingency', () => {
      const populateContingency = BedCountService.__get__('populateContingency');
      var input = {centre: {id: 1}};
      var output = {
        centre: {
          id: 1
        },
        contingency: {
          male: {
            details: {
              'Ops1': 1,
              'Ops2': 13
            },
            total: 14
          },
          female: {
            details: {
              'Ops3': 5,
              'Ops4': 7
            },
            total: 12
          }
        }
      };
      var getPrebookingByCentreGroupByGenderCidOrTaskForceResponse = {
        male: {
          details: {
            'Ops1': 1,
            'Ops2': 13
          },
          total: 14
        },
        female: {
          details: {
            'Ops3': 5,
            'Ops4': 7
          },
          total: 12
        }
      };

      before(() => sinon.stub(Prebooking, 'getPrebookingByCentreGroupByGenderCidOrTaskForce').resolves(getPrebookingByCentreGroupByGenderCidOrTaskForceResponse));

      after(() => Prebooking.getPrebookingByCentreGroupByGenderCidOrTaskForce.restore());

      it('should merge the response of Prebooking.getPrebookingByCentreGroupByGenderCidOrTaskForce into the return', () =>
        expect(populateContingency(input)).to.eventually.deep.equal(output)
      );
    });

    describe('#getReconciliationTester', () => {
      const getReconciliationTester = BedCountService.__get__('getReconciliationTester');
      it('should return a function', () => {
        expect(getReconciliationTester()).to.be.a('function');
      });
      describe('returned function', () => {
        it('should return reconciliation couple when event & movement cid_id match and event timestamp is within the movement reconiciliation range', () => {
          const movementReconciliationRangeFactory = () => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const tester = getReconciliationTester(() => new DateRange(), movementReconciliationRangeFactory);
          const event = {detainee: {cid_id: 1234}, timestamp: new Date('2016/01/15'), operation: 'check in'};
          const movement = {cid_id: 1234, timestamp: new Date('2017/01/01'), direction: 'in'};
          expect(tester(event, movement)).to.deep.equal({event, movement});
        });
        it('should return reconciliation couple when event & movement cid_id match and movement timestamp is within the event reconiciliation range', () => {
          const eventReconciliationRangeFactory = () => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const tester = getReconciliationTester(eventReconciliationRangeFactory, () => new DateRange());
          const event = {detainee: {cid_id: 1234}, timestamp: new Date('2017/01/15'), operation: 'check in'};
          const movement = {cid_id: 1234, timestamp: new Date('2016/01/01'), direction: 'in'};
          expect(tester(event, movement)).to.deep.equal({event, movement});
        });
        it('should return reconciliation couple when event & movement cid_id match and movement timestamp is within the event reconiciliation range and the event timestamp is within the movement reconciliation range', () => {
          const eventReconciliationRangeFactory = () => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const movementReconciliationRangeFactory = () => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const tester = getReconciliationTester(eventReconciliationRangeFactory, movementReconciliationRangeFactory);
          const event = {detainee: {cid_id: 1234}, timestamp: new Date('2016/01/15'), operation: 'check in'};
          const movement = {cid_id: 1234, timestamp: new Date('2016/01/01'), direction: 'in'};
          expect(tester(event, movement)).to.deep.equal({event, movement});
        });
        it('should return false when event type does not resolve with the movement direction', () => {
          const eventReconciliationRangeFactory = () => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const movementReconciliationRangeFactory = () => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const tester = getReconciliationTester(eventReconciliationRangeFactory, movementReconciliationRangeFactory);
          const event = {detainee: {cid_id: 1234}, timestamp: new Date('2016/01/15'), operation: 'check in'};
          const movement = {cid_id: 1234, timestamp: new Date('2016/01/01'), direction: 'out'};
          expect(tester(event, movement)).to.equal(false);
        });
        it('should return false when event & movement cid_id do not match', () => {
          const eventReconciliationRangeFactory = () => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const movementReconciliationRangeFactory = () => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const tester = getReconciliationTester(eventReconciliationRangeFactory, movementReconciliationRangeFactory);
          const event = {detainee: {cid_id: 1111}, timestamp: new Date('2016/01/15'), operation: 'check in'};
          const movement = {cid_id: 2222, timestamp: new Date('2016/01/01'), direction: 'in'};
          expect(tester(event, movement)).to.equal(false);
        });
        it('should return false when movement timestamp isnt within the event reconiciliation range and the event timestamp isnt within the movement reconciliation range', () => {
          const eventReconciliationRangeFactory = () => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const movementReconciliationRangeFactory = () => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const tester = getReconciliationTester(eventReconciliationRangeFactory, movementReconciliationRangeFactory);
          const event = {detainee: {cid_id: 1234}, timestamp: new Date('2016/02/01'), operation: 'check in'};
          const movement = {cid_id: 1234, timestamp: new Date('2016/02/01'), direction: 'in'};
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
    describe('#untersect', () => {
      it('should untersect the correct values', () => {
        const array1 = [
          {matching: 1, unique: 'a1m1'}, // no match
          {matching: 2, unique: 'a1m2'},
          {matching: 3, unique: 'a1m3'},
          {matching: 4, unique: 'a1m4'},
          {matching: 5, unique: 'a1m5'}
        ];
        const array2 = [
          {matching: 0, unique: 'a2m2'}, // no match
          {matching: 2, unique: 'a2m2'},
          {matching: 3, unique: 'a2m3'},
          {matching: 4, unique: 'a2m4'},
          {matching: 5, unique: 'a2m5'},
          {matching: 6, unique: 'a2m6'} // no match
        ];
        const expectedResult = [
          [array1[0]],
          [
            {a: array1[1], b: array2[1]},
            {a: array1[2], b: array2[2]},
            {a: array1[3], b: array2[3]},
            {a: array1[4], b: array2[4]}
          ],
          [array2[0], array2[5]]
        ];
        const reducer = (a, b) => a.matching === b.matching && {a, b};

        const result = BedCountService.__get__('untersect')(array1, array2, reducer);

        expect(result).to.deep.equal(expectedResult);
      });
    });
    describe('#getReinstatementTester', () => {
      const getReinstatementTester = BedCountService.__get__('getReinstatementTester');
      it('should return a function', () => {
        expect(getReinstatementTester()).to.be.a('function');
      });
      describe('returned function', () => {
        it('should return reinstatment couple when person_id, operation type and timestamp match', () => {
          const rangeFactory = (timestamp) => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const tester = getReinstatementTester(rangeFactory);
          const reinstatement = {person_id: 1234, timestamp: new Date('2016/01/15')};
          const event = {person_id: 1234, timestamp: new Date('2016/01/15'), operation: Event.OPERATION_CHECK_OUT};
          expect(tester(reinstatement, event)).to.deep.equal({reinstatement, event});
        });
        it('should return false when person_id does not match', () => {
          const rangeFactory = (timestamp) => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const tester = getReinstatementTester(rangeFactory);
          const reinstatement = {person_id: 1234, timestamp: new Date('2016/01/15')};
          const event = {person_id: 5555, timestamp: new Date('2016/01/15'), operation: Event.OPERATION_CHECK_OUT};
          expect(tester(reinstatement, event)).to.equal(false);
        });
        it('should return false when operation type is not check out', () => {
          const rangeFactory = (timestamp) => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const tester = getReinstatementTester(rangeFactory);
          const reinstatement = {person_id: 1234, timestamp: new Date('2016/01/15')};
          const event = {person_id: 1234, timestamp: new Date('2016/01/15'), operation: Event.OPERATION_CHECK_IN};
          expect(tester(reinstatement, event)).to.equal(false);
        });
        it('should return false when the timestamp falls outside of the result of the range factory', () => {
          const rangeFactory = (timestamp) => new DateRange(new Date('2016/01/01'), new Date('2016/01/31'));
          const tester = getReinstatementTester(rangeFactory);
          const reinstatement = {person_id: 1234, timestamp: new Date('2016/01/15')};
          const event = {person_id: 1234, timestamp: new Date('2016/02/15'), operation: Event.OPERATION_CHECK_OUT};
          expect(tester(reinstatement, event)).to.equal(false);
        });
      });
    });
  });

  describe('performReconciliation', () => {
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
      const checkOutSearchDateRangeFactory = (date) => new DateRange(
        moment(date).subtract(1, 'days').toDate(),
        moment(date).toDate()
      );

      return Centres.findOne({id: 1})
        .then((centre) => {
          return BedCountService.performReconciliation(
            centre,
            vDateRangeFactory(new Date('01/01/2016')),
            eventSearchDateRangeFactory,
            movementSearchDateRangeFactory,
            checkOutSearchDateRangeFactory
          ).then((result) => {
            expect(result).to.be.equal(centre);
            expect(result).to.have.property('reconciled');
            expect(result).to.have.property('reinstatements');
            expect(result).to.have.property('unreconciledEvents');
            expect(result).to.have.property('unreconciledMovements');
            expect(result).to.have.property('unreconciledReinstatements');
            expect(result).to.have.property('outOfCommission');
            expect(result).to.have.property('prebooking');
            expect(result).to.have.property('contingency');
          });
        });
    });
  });
});
