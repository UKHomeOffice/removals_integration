'use strict';

const ValidationError = require('../../../api/lib/exceptions/ValidationError');
const service = require('../../../api/services/RequestValidatorService');

describe('UNIT RequestValidatorService', () => {
  let json_schema = {"type": "number"};
  it('Should return errors for invalid json', () =>
      expect(service.validate("aa", json_schema)).to.eventually.be.rejectedWith(ValidationError)
  );
  it('Should return no errors for known ok json', () =>
      expect(service.validate(4, json_schema)).to.eventually.be.fulfilled
  );
});
