var policy = require('../../../api/policies/POISEPolicy');

describe('UNIT POISE policy', () => {

  describe('forbidden', () => {
    var res = {};
    beforeEach(done => {
      res.forbidden = sinon.spy(done);
      policy({headers: {http_email: 'invlalid@example.com'}}, res, null);
    });

    it('Should execute res.forbidden if the user is unknown', () =>
        expect(res.forbidden).to.be.calledOnce
    );
  });

  describe('known user', () => {
    var next;
    beforeEach(done => {
      next = sinon.spy(done);
      policy({headers: {http_email: 'test@example.com'}}, null, next);
    });

    it('Should execute next if the user is known', () =>
        expect(next).to.be.calledOnce
    );
  });
});
