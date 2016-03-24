/* global Centres BedcountService */
'use strict';

describe('BedCountService', () => {

  describe('getSummary', () => {

    it('should have entries for both male and female', function () {
      return Centres.findOne({ name: 'bigone' })
        .then(BedCountService.getSummary)
        .then((summary) => {
          expect(summary).to.have.property('male');
          expect(summary).to.have.property('female');
        });
    });
  })
});
