"use strict";

describe('INTEGRATION DetaineeEvent model', () => {
  it('should get the fixtures', () =>
    expect(DetaineeEvent.find()).to.eventually.have.length(3)
  );
  describe('getPid', () => {
    var entity = {
      centre: 'foo',
      person_id: '123'
    };
    var expectedPid = 'foo_123';

    it('should return a string formatted from the centre and person_id', () =>
      expect(DetaineeEvent.getPid(entity)).to.equal(expectedPid)
    );
  });
});
