var jhg = require('../../helpers/JsonHelperGenerator');
var validation_schema = require('../../../node_modules/removals_dashboard/assets/schema').centre;

describe('CentreController', function () {
  var controller;
  before(function () {
    controller = sails.controllers.centre;
  });

  it('should be able to get a list of all the centres', function () {
    return request_auth(sails.hooks.http.app)
      .get('/centre')
      .expect(200)
      .expect(function (res) {
        return expect(res.body.data).to.have.length(3)
          .and.to.contain.a.thing.with.property('centre_id', 1)
          .and.to.contain.a.thing.with.property('name', 'bigone');
      });
  });

  it('should be able to add a new centre', function () {
    return request_auth(sails.hooks.http.app)
      .post('/centre')
      .send()
      .expect(201)
      .expect(function (res) {
        return expect(res.body).to.have.property('centre_id');
      });
  });

  it('should be able to update an existing centre', function () {
    return request_auth(sails.hooks.http.app)
      .post('/centre/1')
      .send({name: "renamed"})
      .expect(200)
      .then(function () {
        return Centre.findOne(1).then(function (centre) {
          return expect(centre).to.have.property('name', 'renamed');
        });
      });
  });

  it('should be able to delete an existing centre', function () {
    return request_auth(sails.hooks.http.app)
      .del('/centre/1')
      .expect(200)
      .then(function () {
        return Centre.findOne(1).then(function (centre) {
          return expect(centre).to.be.empty;
        });
      });
  });

  describe('Schema checks', function () {
    it('should provide valid output for a centre', function () {
      return request_auth(sails.hooks.http.app)
        .get('/centre/1')
        .expect(200)
        .then(function (response) {
          return expect(RequestValidatorService.validate(response.body.data, validation_schema)).to.be.eventually.fulfilled;
        });
    });

    it('should provide valid output for centres', function () {
      return request_auth(sails.hooks.http.app)
        .get('/centre')
        .expect(200)
        .then(function (response) {
          return _.map(response.body.data, function (response_body) {
            return expect(RequestValidatorService.validate(response_body, validation_schema)).to.be.eventually.fulfilled;
          });
        });
    });
  });
});
