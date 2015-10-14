var chai = require('chai')
  .use(require('sinon-chai'));
var expect = chai.expect;
var sinon = require('sinon');
var validation_schema = require('removals_schema').heartbeat;

describe('IrcEntryEventRequestValidatorService', function () {

  before(function () {
    sinon.stub(sails.services.requestvalidatorservice, 'validate');
  });

  it('Should call the RequstValidatorService', function () {
    IrcEntryHeartbeatValidatorService.validate({});
    return expect(sails.services.requestvalidatorservice.validate).to.be.calledWith({}, validation_schema);
  });

  after(function () {
    sails.services.requestvalidatorservice.validate.restore();
  });

});
