var Passport = require('passport');

describe('INTEGRATION Passport service', () => {
  beforeEach(() => sinon.stub(User, 'findOne'));
  afterEach(() => User.findOne.restore());

  it('Should call through to User.findOne', () => {
    PassportService.authenticate('Header', (err, user) => {
    })({
      headers: {
        http_email: 'foobar'
      }
    });
    return expect(User.findOne).to.be.calledWith('foobar');
  });
});
