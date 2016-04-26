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
      prebooking_received: null,
      cid_received_date: null,
      name: 'fo',
      id: 123,
      male_capacity: 9,
      female_capacity: 12,
      male_in_use: 4,
      female_in_use: 4,
      male_out_of_commission: 3,
      female_out_of_commission: 9,
      male_prebooking: [{centres: 123, task_force: 'ops1', id: 1}],
      female_prebooking: [{centres: 123, task_force: 'ops2', id: 2}, {centres: 123, task_force: 'ops1', id: 3}],
      male_contingency: [{centres: 123, task_force: 'depmu', id: 1}],
      female_contingency: [{centres: 123, task_force: 'htu', id: 2}, {centres: 123, task_force: 'depmu other', id: 3}],
      male_active_movements_in: [{centres: 123, detainee: 1, id: 1}, {centres: 123, detainee: 2, id: 2}],
      male_active_movements_out: [{centres: 123, detainee: 1, id: 1}, {centres: 123, detainee: 2, id: 2}],
      female_active_movements_in: [{centres: 123, detainee: 3, id: 1}],
      female_active_movements_out: [{centres: 123, detainee: 3, id: 1}],
      modelLinks: sinon.stub().returns(['links'])
    };

    it('should match the expected output', () => {
      let that = dummy_model;
      var expected = {
        attributes: {
          name: that.name,
          cidReceivedDate: that.cid_received_date,
          prebookingReceived: that.prebooking_received,
          heartbeatReceived: null,
          updated: that.updatedAt,
          maleCapacity: that.male_capacity,
          maleInUse: that.male_in_use,
          maleOutOfCommission: that.male_out_of_commission,
          femaleCapacity: that.female_capacity,
          femaleInUse: that.female_in_use,
          femaleOutOfCommission: that.female_out_of_commission,
          maleAvailability: 0,
          femaleAvailability: -5,
          malePrebooking: that.male_prebooking.length,
          femalePrebooking: that.female_prebooking.length,
          maleContingency: that.male_contingency.length,
          femaleContingency: that.female_contingency.length,
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
      expect(subject).to.have.a.property('malePrebooking', 1);
      expect(subject).to.have.a.property('femalePrebooking', 2);
      expect(subject).to.have.a.property('maleContingency', 1);
      expect(subject).to.have.a.property('femaleContingency', 2);
      expect(subject).to.have.a.property('maleActiveMovementsIn', 2);
      expect(subject).to.have.a.property('maleActiveMovementsOut', 2);
      expect(subject).to.have.a.property('femaleActiveMovementsIn', 1);
      expect(subject).to.have.a.property('femaleActiveMovementsOut', 1);
    });

  });

  describe('publishCentreUpdates', () => {
    var populate;
    var dummyMovement = [{id: 1}, {id: 2}, {id: 3}];
    var dummyPrebooking = [{id: 4}, {id: 5}, {id: 6}];
    var dummyContingency = [{id: 7}, {id: 8}, {id: 9}];

    beforeEach(() => {
      populate = sinon.stub().returnsThis();
      let toPromise = sinon.stub().returnsThis();
      sinon.stub(Centres, 'find').returns({
        populate: populate,
        then: sinon.stub().resolves(true),
        map: sinon.stub().resolves(true),
        toPromise: toPromise
      });
    });

    afterEach(() => Centres.find.restore());

    it('should eventually resolve with the prebookings', () =>
      expect(model.publishCentreUpdates(dummyPrebooking)).to.eventually.eql(dummyPrebooking)
    );

    it('Should populate female_prebooking', () =>
      model.publishCentreUpdates()
        .then(() => expect(populate).to.be.calledWith('female_prebooking'))
    );

    it('Should populate male_prebooking', () =>
      model.publishCentreUpdates()
        .then(() => expect(populate).to.be.calledWith('male_prebooking'))
    );

    it('Should populate female_contingency', () =>
      model.publishCentreUpdates()
        .then(() => expect(populate).to.be.calledWith('female_contingency'))
    );

    it('Should populate male_contingency', () =>
      model.publishCentreUpdates()
        .then(() => expect(populate).to.be.calledWith('male_contingency'))
    );

    it('should eventually resolve with the movements', () =>
      expect(model.publishCentreUpdates(dummyMovement)).to.eventually.eql(dummyMovement)
    );

    it('Should populate male_active_movements_in', () =>
      model.publishCentreUpdates()
        .then(() => expect(populate).to.be.calledWith('male_active_movements_in'))
    );

    it('Should populate male_active_movements_out', () =>
      model.publishCentreUpdates()
        .then(() => expect(populate).to.be.calledWith('male_active_movements_out'))
    );

    it('Should populate female_active_movements_in', () =>
      model.publishCentreUpdates()
        .then(() => expect(populate).to.be.calledWith('female_active_movements_in'))
    );

    it('Should populate female_active_movements_out', () =>
      model.publishCentreUpdates()
        .then(() => expect(populate).to.be.calledWith('female_active_movements_out'))
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
