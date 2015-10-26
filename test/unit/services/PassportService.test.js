var Passport = require('passport');
describe('Passport service', function () {
  beforeEach(function () {
    sinon.stub(User, 'findOne');
  });
  afterEach(function () {
    User.findOne.restore();
  });
  it('Should call through to User.findOne', function () {
    PassportService.authenticate('POISE', function (err, user) {
    })({
      headers: {
        http_email: 'foobar'
      }
    });
    return expect(User.findOne).to.be.calledWith('foobar');
  });
});
