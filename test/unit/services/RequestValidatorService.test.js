var request = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe('RequestValidatorService', function () {
  var json_schema = {"type": "number"};
  it('Should return errors for invalid json', function () {
    return expect(RequestValidatorService.validate("aa", json_schema)).to.eventually.be.rejected;
  });
  it('Should return no errors for known ok json', function () {
    return expect(RequestValidatorService.validate(4, json_schema)).to.eventually.be.fulfilled;
  });
});