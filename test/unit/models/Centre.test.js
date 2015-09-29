var chai = require('chai')
  .use(require("chai-as-promised"));
var expect = chai.expect;

describe('CentreModel', function () {

  it('should get the fixtures', function () {
    return expect(Centre.find()).to.eventually.have.length(2);
  });

});