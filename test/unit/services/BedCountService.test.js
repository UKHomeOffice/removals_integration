/* global Centres BedCountService */
'use strict';

var moment = require('moment');
var rewire = require('rewire');
var BedCountService = rewire('../../../api/services/BedCountService');

const vDateRangeFactory = (date) => new BedCountService.DateRange(
  moment(date).subtract(2, 'days').startOf('day').toDate(),
  moment(date).endOf('day').toDate()
);
const eventSearchDateRangeFactory = (date) => new BedCountService.DateRange(
  moment(date).subtract(2, 'days').startOf('day').toDate(),
  moment(date).endOf('day').toDate()
);
const movementSearchDateRangeFactory = (date) => new BedCountService.DateRange(
  moment(date).startOf('day').toDate(),
  moment(date).add(2, 'days').endOf('day').toDate()
);

describe('UNIT BedCountService', () => {

  describe('helper function', () => {
    describe('#populate', () => {
      const populate = BedCountService.__get__('populate');

      it('should find all items from the specified centre only', () =>
        populate(Movement, 1, new BedCountService.DateRange(new Date('2000/01/01'), new Date('2100/01/01')))
          .then(movements => {
            expect(movements).to.have.length(4);
            return movements.every(movement =>
              expect(movement).to.have.property('centre', 1));
          })
      );

      it('should find all items from the specified date range only', () => {
        const start = new Date('2016/02/22'), end = new Date('2016/02/27');
        return populate(Movement, 1, new BedCountService.DateRange(start, end))
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
  });

  describe('calculateCentreState', () => {
    it('should eventually return a result object', () => {
      return Centres.findOne({ id: 1 })
        .then((centre) => {
          return BedCountService.calculateCentreState(
            centre,
            vDateRangeFactory(new Date('01/01/2016')),
            eventSearchDateRangeFactory,
            movementSearchDateRangeFactory
          ).then((result) => {
            expect(result).to.have.property('reconciled');
            expect(result).to.have.property('unreconciledEvents');
            expect(result).to.have.property('unreconciledMovements');
          });
        });
    });
  });
});
