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
      active_male_centre: 'fooo',
      active_female_centre: 'rra',
      centre: 123,
      active: true
    };

    it('should delete the records relationships if its not active', () => {
      var record = {
        active_male_centre: 'fooo',
        active_female_centre: 'rra',
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
          expect(record.active_male_centre).to.eql(123)
        )
    });

    it('should set the correct normalised values for a female detainee', () => {
      var Detainee = {findOne: sinon.stub().resolves({gender: "female"})};
      model.__set__('Detainee', Detainee);
      return method(record)
        .then(() =>
          expect(record.active_female_centre).to.eql(123)
        )
    });
  });
})
