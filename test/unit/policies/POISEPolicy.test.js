var policy = require('../../../api/policies/POISEPolicy');
var Promise = require('bluebird');

describe('POISE policy', function () {

  describe('forbidden', function () {
    var res = {};
    beforeEach(function (done) {
      res.forbidden = sinon.spy(done);
      policy({headers: {http_email: 'invlalid@example.com'}}, res, null);
    });

    it('Should execute res.forbidden if the user is unknown', function () {
      return expect(res.forbidden).to.be.calledOnce;
    });
  });

  describe('known user', function () {
    var next;
    beforeEach(function (done) {
      next = sinon.spy(done);
      policy({headers: {http_email: 'test@example.com'}}, null, next);
    });

    it('Should execute next if the user is known', function () {
      return expect(next).to.be.calledOnce;
    });

  });

})
;
