var chai = require('chai')
  .use(require("chai-as-promised"));
var expect = chai.expect;
var sinon = require('sinon');
var _ = require('lodash');

describe('Reservation Model', function () {

  var valid_reservation = {
    "status": true,
    "taskforce": "east west task force",
    "centre": 1,
    "male_count": 1000,
    "female_count": 2500,
    "start_date": "2120-12-15",
    "end_date": "2122-12-15"
  };

  it('should get the fixtures', function () {
    return expect(Reservation.find()).to.eventually.have.length(6);
  });

  it('should be able to add a valid reservation', function () {
    return expect(Reservation.create(valid_reservation)).to.be.eventually.fulfilled;
  });
  describe('Expiry date', function () {
    //TODO: these need to have the TBC criteria of when dates come in and out
    var scenarios = [
      {
        description: 'one date',
        mock_creation_date: new Date('1995-12-17T03:24:00'),
        expected_expiry_date: new Date('1995-12-18T03:24:00')
      },
      {
        description: 'another',
        mock_creation_date: new Date('1995-12-17T03:24:00'),
        expected_expiry_date: new Date('1995-12-18T03:24:00')
      }
    ];
    return _.map(scenarios, function (scenario) {
      return it('should pass the current date to the service', function () {
        var clock = sinon.useFakeTimers(scenario.mock_creation_date.getTime());
        var reservation = Reservation.create({})
          .then(function (reservation) {
            return reservation.expiry;
          });
        clock.restore();
        return expect(reservation).to.eventually.eql(scenario.expected_expiry_date);
      });
    });
  });
  it.skip('should throw an exception adding a reservation with a start date < 3 days from now', function () {
    var invalid_reservation = valid_reservation;
    invalid_reservation.start_date = "2000-01-01";
    return expect(Reservation.create(invalid_reservation)).to.be.eventually.rejected;
  });

  it.skip('should throw an exception adding a reservation with a end date before the start date', function () {
    var invalid_reservation = valid_reservation;
    invalid_reservation.start_date = "2110-01-01";
    return expect(Reservation.create(invalid_reservation)).to.be.eventually.rejected;
  });
});
