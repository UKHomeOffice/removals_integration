'use strict';

const DateRange = require('../../../api/lib/DateRange');
const moment = require('moment');

describe('DateRange', () => {

  describe('constructor', () => {
    it('should assign properties correctly', () => {
      var from = new Date();
      var to = new Date();
      var result = new DateRange(from, to);
      expect(result).to.have.property('from', from);
      expect(result).to.have.property('to', to);
    });
  });

  describe('contains', () => {
    it('should return true if the date falls within the date range', () => {
      var date = new Date();
      var from = moment(date).subtract(1, 'second').toDate();
      var to = moment(date).add(1, 'second').toDate();

      var dateRange = new DateRange(from, to);

      expect(dateRange.contains(date)).to.equal(true);
      expect(dateRange.contains(from)).to.equal(true);
      expect(dateRange.contains(to)).to.equal(true);
    });

    it('should return false if the date falls outside the date range', () => {
      var date = new Date();
      var from = moment(date).subtract(1, 'second').toDate();
      var to = moment(date).add(1, 'second').toDate();

      var dateRange = new DateRange(from, to);

      expect(dateRange.contains(moment(from).subtract(1, 'second').toDate())).to.equal(false);
      expect(dateRange.contains(moment(to).add(1, 'second').toDate())).to.equal(false);
    });
  });
  describe('widen', () => {
    it('should return a DateRange from the earliest point, to the latest point of n DateRanges', () => {
      const r1 = new DateRange(new Date('2016/01/01'), new Date('2016/01/02'));
      const r2 = new DateRange(new Date('2016/01/03'), new Date('2016/01/04'));
      const r3 = new DateRange(new Date('2016/01/05'), new Date('2016/01/06'));

      const result = DateRange.widen(r3,r2,r1);
      expect(result.from).to.equal(r1.from);
      expect(result.to).to.equal(r3.to);
    });
    it('should return the same result regardless of argument order', () => {
      const r1 = new DateRange(new Date('2016/01/01'), new Date('2016/01/02'));
      const r2 = new DateRange(new Date('2016/01/03'), new Date('2016/01/04'));
      const r3 = new DateRange(new Date('2016/01/05'), new Date('2016/01/06'));

      const result = DateRange.widen(r3,r2,r1);
      const result2 = DateRange.widen(r1,r3,r2);
      expect(result.from).to.equal(result2.from);
      expect(result.to).to.equal(result2.to);
    });
    it('should work with overlapping ranges', () => {
      const r1 = new DateRange(new Date('2016/01/01'), new Date('2016/01/02'));
      const r2 = new DateRange(new Date('2015/12/03'), new Date('2016/01/02'));
      const r3 = new DateRange(new Date('2016/01/01'), new Date('2016/02/06'));

      const result = DateRange.widen(r3,r2,r1);
      expect(result.from).to.equal(r2.from);
      expect(result.to).to.equal(r3.to);
    });
  });
});

