var validation_schema = require('removals_schema').event;

describe('IrcEntryEventRequestValidatorService', function () {

  before(function () {
    sinon.stub(sails.services.requestvalidatorservice, 'validate');
  });

  it('Should call the RequstValidatorService', function () {
    IrcEntryEventValidatorService.validate({});
    return expect(sails.services.requestvalidatorservice.validate).to.be.calledWith({}, validation_schema);
  });

  after(function () {
    sails.services.requestvalidatorservice.validate.restore();
  });

});
