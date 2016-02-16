"use strict";
var model = rewire('../../api/models/Movement');
var Promise = require('bluebird');

describe('INTEGRATION MovementModel', () => {
  it('should get the fixtures', () =>
    expect(Movement.find()).to.eventually.have.length(5)
  );
});

describe('UNIT MovementModel', () => {
  describe('setNormalisedRelationships', () => {
    var method = Promise.promisify(model.__get__('setNormalisedRelationships'));

    var record = {
      active_male_centre_in: 'foo',
      active_male_centre_out: 'bar',
      active_female_centre_in: 'baz',
      active_female_centre_out: 'raa',
      centre: 123,
      active: true,
      direction: 'out'
    };

    it('should delete the records relationships if its not active', () => {
      var record = {
        active_male_centre_in: 'foo',
        active_male_centre_out: 'bar',
        active_female_centre_in: 'baz',
        active_female_centre_out: 'raa',
        active: false
      };
      return method(record)
        .then(() =>
          expect(record).to.eql({
            active: false
          })
        );
    });

    it('should set the correct normalised values for a male detainee', () => {
      var Detainee = {findOne: sinon.stub().resolves({gender: "male"})};
      model.__set__('Detainee', Detainee);
      return method(record)
        .then(() =>
          expect(record.active_male_centre_out).to.eql(123)
        )
    });

    it('should set the correct normalised values for a female detainee', () => {
      var Detainee = {findOne: sinon.stub().resolves({gender: "female"})};
      model.__set__('Detainee', Detainee);
      return method(record)
        .then(() =>
          expect(record.active_female_centre_out).to.eql(123)
        )
    });
  });
})
