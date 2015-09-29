var chai = require('chai')
  .use(require('sinon-chai'));
var expect = chai.expect;
var sinon = require('sinon');

describe('IrcRequestValidatorService', function () {

  it('Should call the RequstValidatorService', function () {
    sinon.stub(sails.services.requestvalidatorservice, 'validate');

    IrcRequestValidatorService.validate({});

    return expect(sails.services.requestvalidatorservice.validate).to.be.calledWithMatch({}, {"type": "object"});
  });

  after(function () {
    sails.services.requestvalidatorservice.validate.restore();
  });

});