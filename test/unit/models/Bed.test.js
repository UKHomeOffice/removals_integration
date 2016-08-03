'use strict';

const model = rewire('../../api/models/Bed');

describe('UNIT BedModel', () => {
});

describe('INTEGRATION BedModel', () => {
  it('should get the fixtures', () =>
    expect(Bed.find()).to.eventually.have.length(15)
  );
});
