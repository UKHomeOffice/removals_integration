"use strict";
var model = rewire('../../api/models/Port');

describe('UNIT BedModel', () => {
});

describe('INTEGRATION PortModel', () => {
  it('should get the fixtures', () =>
    expect(Port.find()).to.eventually.have.length(10)
  );
});
