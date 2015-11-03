var policy = require('../../../api/policies/NoPOISEPolicy');

describe('UNIT No POISE policy', () => {
  var res = {};
  var next;
  beforeEach(()=> {
    res.forbidden = sinon.spy();
    next = sinon.spy();
  });

  it('Should execute res.forbidden if the user is unknown', () => {
    policy({headers: {http_email: 'invlalid@example.com'}}, res, next);
    return expect(res.forbidden).to.be.calledOnce;
  });

  it('Should execute res.forbidden if the user is known', () => {
    policy({headers: {http_email: 'test@example.com'}}, res, next);
    return expect(res.forbidden).to.be.calledOnce;
  });

  it('Should execute next if theres no user', () => {
    policy({}, res, next);
    return expect(next).to.be.calledOnce;
  });

});
