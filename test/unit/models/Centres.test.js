"use strict";
var ValidationError = require('../../../api/lib/exceptions/ValidationError');
var model = require('../../../api/models/Centres');

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
      cid_received_date: new Date,
      name: 'fo',
      id: 123,
      male_capacity: 9,
      female_capacity: 12,
      male_in_use: 4,
      female_in_use: 4,
      male_out_of_commission: 3,
      female_out_of_commission: 9,
      male_active_movements_in: [{centres: 123, subjects: 1, id: 1}, {centres: 123, subjects: 2, id: 2}],
      male_active_movements_out: [{centres: 123, subjects: 1, id: 1}, {centres: 123, subjects: 2, id: 2}],
      female_active_movements_in: [{centres: 123, subjects: 3, id: 1}],
      female_active_movements_out: [{centres: 123, subjects: 3, id: 1}],
      modelLinks: sinon.stub().returns(['links'])
    };

    it('should match the expected output', () => {
      let that = dummy_model;
      var expected = {
        attributes: {
          name: that.name,
          cidReceivedDate: that.cid_received_date,
          heartbeatRecieved: null,
          updated: that.updatedAt,
          maleCapacity: that.male_capacity,
          maleInUse: that.male_in_use,
          maleOutOfCommission: that.male_out_of_commission,
          femaleCapacity: that.female_capacity,
          femaleInUse: that.female_in_use,
          femaleOutOfCommission: that.female_out_of_commission,
          maleAvailability: 2,
          femaleAvailability: -1,
          maleActiveMovementsIn: that.male_active_movements_in.length,
          maleActiveMovementsOut: that.male_active_movements_out.length,
          femaleActiveMovementsIn: that.female_active_movements_in.length,
          femaleActiveMovementsOut: that.female_active_movements_out.length
        },
        id: that.id.toString(),
        type: "centre",
        links: [
          'links'
        ]
      };
      return expect(model.attributes.toJSON.call(that)).to.eql(expected);
    });

    it('Should have properties set for male and female capacity and occupancy', () => {
      const that = _.clone(dummy_model);
      const subject = model.attributes.toJSON.call(that).attributes;
      expect(subject).to.have.a.property('name', 'fo');
      expect(subject).to.have.a.property('maleCapacity', 9);
      expect(subject).to.have.a.property('femaleCapacity', 12);
      expect(subject).to.have.a.property('maleInUse', 4);
      expect(subject).to.have.a.property('femaleInUse', 4);
      expect(subject).to.have.a.property('maleActiveMovementsIn', 2);
      expect(subject).to.have.a.property('maleActiveMovementsOut', 2);
      expect(subject).to.have.a.property('femaleActiveMovementsIn', 1);
      expect(subject).to.have.a.property('femaleActiveMovementsOut', 1);
    });

  });

  describe('removeNonOccupancy', () => {
    beforeEach(() => {
      sinon.spy(Centres, 'destroy');
      Centres.removeNonOccupancy();
    });

    afterEach(() => Centres.destroy.restore())

    it('should destroy centres with "non-occupancy" as mo-type', () =>
      expect(Centres.destroy).to.have.been.calledWith({'mo-type':'non-occupancy'})
    );
  });
});

describe('INTEGRATION CentreModel', () => {
  it('should get the fixtures', () =>
    expect(Centres.find()).to.eventually.have.length(3)
  );

  it('should be able to get a centre by the name', () =>
    expect(Centres.getByName("anotherone")).to.be.eventually.fulfilled
  );

  it('should throw exception when unable to get by name', () =>
    expect(Centres.getByName("invalid centre")).to.be.eventually.rejectedWith(ValidationError)
  );
});
