"use strict";

describe('INTEGRATION MovementModel', () => {
  it('should get the fixtures', () => {
    expect(Movement.find()).to.eventually.have.length(5)
  });
});

