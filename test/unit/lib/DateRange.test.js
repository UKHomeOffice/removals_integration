var DateRange = require('../../../api/lib/DateRange');
var moment = require('moment');

describe.only('DateRange', () => {
  
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
  
});

