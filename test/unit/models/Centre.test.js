var chai = require('chai')
  .use(require("chai-as-promised"));
var expect = chai.expect;

describe('CentreModel', function () {

  it('should get the fixtures', function () {
    return expect(Centre.find()).to.eventually.have.length(3);
  });

  it('should load the reservations collection', function () {
    return expect(Centre.findOne({name: "bigone"}).populate('reservations'))
      .to.eventually.have.property("reservations")
      .and.to.have.length(3);
  });

});
