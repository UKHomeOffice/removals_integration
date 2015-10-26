var policy = require('../../../api/policies/POISEPolicy');
var Promise = require('bluebird');

describe('POISE policy', function () {

  it('Should execute res.forbidden if the user is unknown', function () {
    var res = {
      forbidden: new sinon.stub()
    };
    policy({headers: {http_email: 'invlalid@example.com'}}, res, null);
    // TODO: having to structure an intentional delay is awful, we should really be able to asset that a stub is eventually called, but this doesn't work
    return Promise.resolve().delay(1).then(function () {
      return expect(res.forbidden).to.be.calledOnce;
    });
  });

  it('Should execute next if the user is known', function () {
    var next = new sinon.stub();
    // TODO: having to structure an intentional delay is awful, we should really be able to asset that a stub is eventually called, but this doesn't work
    policy({headers: {http_email: 'test@example.com'}}, null, next);
    return Promise.resolve().delay(1).then(function () {
      return expect(next).to.be.calledOnce;
    });
  });
});
