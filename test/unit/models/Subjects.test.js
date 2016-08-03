'use strict';

describe('INTEGRATION SubjectsModel', () => {
  it('should get the fixtures', () => {
    expect(Subjects.find()).to.eventually.have.length(3)
  });
});
