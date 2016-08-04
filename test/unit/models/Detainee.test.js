'use strict';

const model = rewire('../../api/models/Detainee');

describe('UNIT DetaineeModel', () => {
});

describe('INTEGRATION DetaineeModel', () => {
  it('should get the fixtures', () =>
    expect(Detainee.find()).to.eventually.have.length(4)
  );
});
