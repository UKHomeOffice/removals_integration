"use strict";
var ValidationError = require('../../../api/lib/exceptions/ValidationError');
var model = require('../../../api/models/Centre');

describe('UNIT CentreModel', () => {
  describe('getByName', () => {
    it('should return a centre if there is one', () => {
      let centre = {name: 'foo'};
      let that = {
        findByName: () => Promise.resolve([centre])
      };
      return expect(model.getByName.call(that)).to.eventually.eql(centre);
    });

    it('should throw an exception if there if there is no matching centre', () => {
      let that = {
        findByName: () => Promise.resolve([])
      };
      return expect(model.getByName.call(that)).to.be.eventually.rejectedWith(ValidationError)
    });

    it('should pass the name through to the findByName', () => {
      let that = {
        findByName: sinon.stub().resolves([{name: 'foo'}])
      };
      model.getByName.call(that, 'foo');
      return expect(that.findByName).to.be.calledWith('foo');
    });
  });

  describe('attributes.toJSON', () => {
    var dummy_model = {
      updatedAt: 'f',
      name: 'fo',
      id: 123,
      male_capacity: 9,
      female_capacity: 12,
      male_in_use: 4,
      female_in_use: 4,
      male_out_of_commission: 3,
      female_out_of_commission: 9,
      modelLinks: sinon.stub().returns(['links'])
    };

    it('should match the expected output', () => {
      let that = dummy_model;
      var expected = {
        attributes: {
          name: that.name,
          updated: that.updatedAt,
          beds: [
            {
              type: "male",
              capacity: that.male_capacity,
              occupied: that.male_in_use,
              ooc: that.male_out_of_commission
            },
            {
              type: "female",
              capacity: that.female_capacity,
              occupied: that.female_in_use,
              ooc: that.female_out_of_commission
            }
          ]
        },
        id: that.id,
        type: "centres",
        links: [
          'links'
        ]
      };
      return expect(model.attributes.toJSON.call(that)).to.eql(expected);
    });

    it('should not return female bed stats if there is 0 female capacity', () => {
      let that = _.clone(dummy_model);
      that.female_capacity = 0;
      return expect(model.attributes.toJSON.call(that).attributes)
        .to.have.a.property('beds')
        .and.to.contain.a.thing.with.property('type', 'male')
        .and.to.not.contain.a.thing.with.property('type', 'female');
    });

    it('should not return female bed stats if there is 0 male capacity', () => {
      let that = _.clone(dummy_model);
      that.male_capacity = 0;
      return expect(model.attributes.toJSON.call(that).attributes)
        .to.have.a.property('beds')
        .and.to.contain.a.thing.with.property('type', 'female')
        .and.to.not.contain.a.thing.with.property('type', 'male');
    });

  });
});

describe('INTEGRATION CentreModel', () => {
  it('should get the fixtures', () =>
      expect(Centre.find()).to.eventually.have.length(3)
  );

  it('should be able to get a centre by the name', () =>
      expect(Centre.getByName("anotherone")).to.be.eventually.fulfilled
  );

  it('should throw exception when unable to get by name', () =>
      expect(Centre.getByName("invalid centre")).to.be.eventually.rejectedWith(ValidationError)
  );
});
