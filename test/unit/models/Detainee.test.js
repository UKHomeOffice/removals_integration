'use strict';

const model = rewire('../../api/models/Detainee');

describe('UNIT DetaineeModel', () => {
  it('#getPid', () =>
    expect(model.__get__('getPid')({centre: {id: 'ff'}, person_id: 'foo'})).to.eql("ff_foo")
  );
});

describe('INTEGRATION DetaineeModel', () => {
  it('should get the fixtures', () =>
    expect(Detainee.find()).to.eventually.have.length(4)
  );
});
