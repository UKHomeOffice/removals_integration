'use strict';

var model = rewire('../../api/models/Prebooking');
var Promise = require('bluebird');

describe('UNIT PrebookingModel', () => {
  describe('setNormalisedRelationships', () => {
    var method = Promise.promisify(model.__get__('setNormalisedRelationships'));

    it('should set the correct normalised pre-booking values for a male subject', () => {
      var record = {
        male_prebooking: 'foo',
        female_prebooking: 'bar',
        centre: 123,
        gender: 'male',
        task_force: 'ops1',
        cid_id: '123'
      };

      return method(record)
        .then(() =>
          expect(record.male_prebooking).to.eql(123)
        )
        .then(() =>
          expect(record.female_prebooking).to.be.undefined
        )
    });

    it('should set the correct normalised pre-booking values for a female subject', () => {
      var record = {
        male_prebooking: 'foo',
        female_prebooking: 'bar',
        centre: 123,
        gender: 'female',
        task_force: 'ops1',
        cid_id: '123'
      };

      return method(record)
        .then(() =>
          expect(record.female_prebooking).to.eql(123)
        )
        .then(() =>
          expect(record.male_prebooking).to.be.undefined
        )
    });

    it('should set the correct normalised contingency-booking values for a male subject', () => {
      var record = {
        male_prebooking: 'foo',
        female_prebooking: 'bar',
        centre: 123,
        gender: 'male',
        task_force: 'ops1',
        contingency: true,
        cid_id: '123'
      };

      return method(record)
        .then(() =>
          expect(record.male_contingency).to.eql(123)
        )
        .then(() =>
          expect(record.female_contingency).to.be.undefined
        )
    });

    it('should set the correct normalised contingency-booking values for a female subject', () => {
      var record = {
        male_prebooking: 'foo',
        female_prebooking: 'bar',
        centre: 123,
        gender: 'female',
        task_force: 'ops1',
        contingency: true,
        cid_id: '123'
      };

      return method(record)
        .then(() =>
          expect(record.female_contingency).to.eql(123)
        )
        .then(() =>
          expect(record.male_contingency).to.be.undefined
        )
    });
  });
});

describe('INTEGRATION PrebookingModel', () => {
  it('should get the fixtures', () =>
    expect(Prebooking.find()).to.eventually.have.length(6)
  );
});
