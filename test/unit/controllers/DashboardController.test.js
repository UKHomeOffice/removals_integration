var request = require('supertest');
var chai = require('chai');
var expect = chai.expect;

describe('DashboardController', function () {
  it('should return a valid json dashboard', function () {
    return request(sails.hooks.http.app)
      .get('/Dashboard')
      .expect(200)
      .expect(function (res) {
        return expect(res.body).to.have.length(3).and.to.contain(
          {
            name: 'bigone',
            centre_id: 1,
            male_capacity: 1000,
            male_available: 1000,
            female_capacity: 2500,
            female_available: 2500,
            booked: 0,
            reserved: 0
          });
      });
  });
});