'use strict';

describe('INTEGRATION Events model', () => {
  describe('when loaded', () => {
    it('should get the fixtures', () =>
      expect(Events.find()).to.eventually.have.length(4)
    );
  });
});
