"use strict";
var model = rewire('../../api/models/Detainee');

describe('UNIT DetaineeModel', () => {
  describe('getDetaineeByPersonIdAndCentre', () => {
    beforeEach(() => sinon.stub(Detainee, 'findOne').resolves({id: 2}));

    afterEach(() => Detainee.findOne.restore());

    it('should return detainee id if pid is not falsey', () =>
      expect(model.getDetaineeByPersonIdAndCentre('123', 1)).to.eventually.equal(2)
    );

    it('should return null if pid is null', () =>
      expect(model.getDetaineeByPersonIdAndCentre(null, 1)).to.eventually.equal(null)
    );

    it('should return null if pid is undefined', () =>
      expect(model.getDetaineeByPersonIdAndCentre(undefined, 1)).to.eventually.equal(null)
    );
  });
});

describe('INTEGRATION DetaineeModel', () => {
  it('should get the fixtures', () =>
    expect(Detainee.find()).to.eventually.have.length(4)
  );
});
