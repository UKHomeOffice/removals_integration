'use strict';

describe('INTEGRATION Detainees model', () => {
  it('should get the fixtures', () =>
    expect(Detainees.find()).to.eventually.have.length(2)
  );
});
