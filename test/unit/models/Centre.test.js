var ValidationError = require('../../../api/lib/exceptions/ValidationError');

describe('CentreModel', function () {

  it('should get the fixtures', function () {
    return expect(Centre.find()).to.eventually.have.length(3);
  });

  it('should be able to get a centre by the name', function () {
    return expect(Centre.getByName("anotherone")).to.be.eventually.fulfilled;
  });

  it('should throw exception when unable to get by name', function () {
    return expect(Centre.getByName("invalid centre")).to.be.eventually.rejectedWith(ValidationError);
  });

});
