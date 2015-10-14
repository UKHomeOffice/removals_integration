var ValidationError = require('../../../api/lib/exceptions/ValidationError');

describe('RequestValidatorService', function () {
  var json_schema = {"type": "number"};
  it('Should return errors for invalid json', function () {
    return expect(RequestValidatorService.validate("aa", json_schema)).to.eventually.be.rejectedWith(ValidationError);
  });
  it('Should return no errors for known ok json', function () {
    return expect(RequestValidatorService.validate(4, json_schema)).to.eventually.be.fulfilled;
  });
});
