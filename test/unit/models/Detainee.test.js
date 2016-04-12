"use strict";

describe('INTEGRATION DetaineeModel', () => {
  it('should get the fixtures', () =>
    expect(Detainee.find()).to.eventually.have.length(3)
  );
});
