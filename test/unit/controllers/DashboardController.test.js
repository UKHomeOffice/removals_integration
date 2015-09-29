var request = require('supertest');
var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;

describe('DashboardController', function () {
  it('should fail invalid json', function () {
    return request(sails.hooks.http.app)
      .get('/Dashboard')
      .expect(200)
      .expect(function (res) {
        expect(res.body).to.have.length(3);
      });
  });
});