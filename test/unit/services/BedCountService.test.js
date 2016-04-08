/* global Centres BedCountService */
'use strict';
var moment = require('moment');

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
