"use strict";

const rewire = require('rewire');
var ValidationError = require('../../../api/lib/exceptions/ValidationError');
var model = rewire('../../../api/models/Centres');
var Promise = require('bluebird');

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
    const dummy_model = {
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
      outOfCommission: {
        female: {'Maintenance - Health and Safety Concern': 8, 'Other': 1},
        male: {'Crime Scene': 2, 'Other': 1}
      },
      male_prebooking: [],
      female_prebooking: [
        {centres: 123, task_force: 'ops2', id: 2},
        {centres: 123, task_force: 'ops2', id: 22},
        {centres: 123, task_force: 'ops2', id: 21},
        {centres: 123, task_force: 'ops1', id: 1},
        {centres: 123, task_force: 'ops1', id: 11}
      ],
      male_contingency: [],
      female_contingency: [{centres: 123, task_force: 'htu', id: 2}, {centres: 123, task_force: 'depmu other', id: 3}],
      modelLinks: sinon.stub().returns(['links'])
    };
    const result = {
      attributes: {
        name: dummy_model.name,
        cidReceivedDate: dummy_model.cid_received_date,
        prebookingReceived: dummy_model.prebooking_received,
        heartbeatReceived: null,
        updated: dummy_model.updatedAt,
        maleCapacity: dummy_model.male_capacity,
        maleInUse: dummy_model.male_in_use,
        maleOutOfCommissionTotal: dummy_model.male_out_of_commission,
        maleOutOfCommissionDetail: dummy_model.outOfCommission['male'],
        femaleCapacity: dummy_model.female_capacity,
        femaleInUse: dummy_model.female_in_use,
        femaleOutOfCommissionTotal: dummy_model.female_out_of_commission,
        femaleOutOfCommissionDetail: dummy_model.outOfCommission['female'],
        malePrebooking: dummy_model.male_prebooking.length,
        malePrebookingDetail: {},
        femalePrebooking: dummy_model.female_prebooking.length,
        femalePrebookingDetail: {
          ops1: { total: 2, cids: [] },
          ops2: { total: 3, cids: [] }
        },
        maleContingency: dummy_model.male_contingency.length,
        femaleContingency: dummy_model.female_contingency.length,
        maleAvailability: 2,
        femaleAvailability: -8
      },
      id: dummy_model.id.toString(),
      type: "centre",
      links: [
        'links'
      ]
    };

    it('should match the expected output', () => {
      const that = Object.assign({}, dummy_model),
        expected = Object.assign({}, result);
      return expect(model.attributes.toJSON.call(that)).to.deep.equal(expected);
    });

    it('should match the expected output when reconciled is set', () => {
      const that = Object.assign({}, dummy_model, {
        reconciled: [],
        unreconciledMovements: [],
        unreconciledEvents: []
      });
      const expected = _.merge({}, result, {
        attributes: {
          femaleUnexpectedIn: [],
          femaleExpectedIn: [],
          femaleExpectedOut: [],
          maleUnexpectedIn: [],
          maleExpectedIn: [],
          maleExpectedOut: []
        }
      });
      return expect(model.attributes.toJSON.call(that)).to.deep.equal(expected);
    });

    it('Should have properties set for male and female capacity and occupancy', () => {
      const that = _.clone(dummy_model);
      const subject = model.attributes.toJSON.call(that).attributes;
      expect(subject).to.have.a.property('name', 'fo');
      expect(subject).to.have.a.property('maleCapacity', 9);
      expect(subject).to.have.a.property('femaleCapacity', 12);
      expect(subject).to.have.a.property('maleInUse', 4);
      expect(subject).to.have.a.property('femaleInUse', 4);
      expect(subject).to.have.a.property('malePrebooking', 0);
      expect(subject).to.have.a.property('femalePrebooking', 5);
      expect(subject).to.have.a.property('maleContingency', 0);
      expect(subject).to.have.a.property('femaleContingency', 2);
    });
  });

  describe('helpers', () => {

    describe('#unreconciledMovementReducer', () => {
      const unreconciledMovementFilter = model.__get__('unreconciledMovementReducer');
      const movements = [{
        id: 1, cid_id: 11,
        gender: 'male', direction: 'in'
      }, {
        id: 2, cid_id: 22,
        gender: 'male', direction: 'in'
      }, {
        id: 3, cid_id: 33,
        gender: 'male', direction: 'out'
      }, {
        id: 4, cid_id: 44,
        gender: 'female', direction: 'in'
      }];

      it('should reduce the unreconciled movements to only those with the specified `gender` and `direction`', () => {
        expect(unreconciledMovementFilter(movements, 'female', 'in'))
          .to.have.lengthOf(1).and.have.deep.property('[0].cid_id', 44);
        expect(unreconciledMovementFilter(movements, 'male', 'in'))
          .to.have.lengthOf(2);
        return expect(unreconciledMovementFilter(movements, 'female', 'out')).to.be.empty;
      });

      it('should reduce the filtered movements to simplified objects containing only the `id` and `cid_id` attributes', () => {
        expect(unreconciledMovementFilter(movements, 'male', 'in')).to.deep.equal([
          { id: 1, cid_id: 11 },
          { id: 2, cid_id: 22 }
        ]);
      });
    });

    describe('#unreconciledEventReducer', () => {
      const unreconciledEventReducer = model.__get__('unreconciledEventReducer');
      const events = [{
        id: 1, operation: 'check in',
        detainee: { gender: 'male', cid_id: 11 }
      }, {
        id: 2, operation: 'check in',
        detainee: { gender: 'male', cid_id: 22 }
      }, {
        id: 3, operation: 'check out',
        detainee: { gender: 'male', cid_id: 33 }
      }, {
        id: 4, operation: 'check in',
        detainee: { gender: 'female', cid_id: 44 }
      }];

      it('should reduce the unreconciled events to only those with the specified `gender` and `operation`', () => {
        expect(unreconciledEventReducer(events, 'female', 'check in'))
          .to.have.lengthOf(1).and.have.deep.property('[0].cid_id', 44);
        expect(unreconciledEventReducer(events, 'male', 'check in'))
          .to.have.lengthOf(2);
        return expect(unreconciledEventReducer(events, 'female', 'check out')).to.be.empty;
      });

      it('should reduce the filtered events to simplified objects containing only the `id` and `cid_id` attributes', () => {
        expect(unreconciledEventReducer(events, 'male', 'check in')).to.deep.equal([
          { id: 1, cid_id: 11 },
          { id: 2, cid_id: 22 }
        ]);
      });
    });

    describe('#buildDetail', function () {
      const items = [
        {centres: 123, task_force: 'ops2', id: 2},
        {centres: 123, task_force: 'ops2', id: 22},
        {centres: 123, task_force: 'ops2', id: 21},
        {centres: 123, task_force: 'ops2', id: 211, cid_id: 2211},
        {centres: 123, task_force: 'ops2', id: 212, cid_id: 2212},
        {centres: 123, task_force: 'ops1', id: 1},
        {centres: 123, task_force: 'ops1', id: 11}
      ];
      const taskForces = ['ops1', 'ops2'];
      const totals = _.countBy(items, 'task_force');
      const buildDetail = model.__get__('buildDetail');

      before('build the item detail', () => {
        this.detail = buildDetail(items);
      });

      it('should return an object', () => expect(this.detail).to.be.an('object'));

      it('should return an empty object if no items were present', () =>
        expect(buildDetail([])).to.be.empty
      );

      it('should otherwise have sub-details for each `task_force`', () =>
        expect(this.detail).to.have.keys(taskForces)
      );

      describe('each `task_force` sub-detail', () => {
        it('should have a `total` number of items', () =>
          taskForces.forEach(taskForce =>
            expect(this.detail[taskForce]).to.be.an('object').that.has.property('total', totals[taskForce])
          )
        );

        describe('has a list of associated CID IDs, which', () => {
          it('should be blank if none of the items had an associated CID', () =>
            expect(this.detail).to.have.deep.property('ops1.cids').that.is.an('array').with.lengthOf(0)
          );

          it('should otherwise contain reduced versions of the items with CIDs', () =>
            expect(this.detail).to.have.deep.property('ops2.cids').that.is.an('array')
              .that.deep.equals([
                {id: 211, cid_id: 2211},
                {id: 212, cid_id: 2212}
              ])
          );
        });
      });
    });

  });

  describe('publishUpdateAll / publishUpdateOne', () => {
    beforeEach(() => {
      sinon.stub(Centres, 'publishUpdate');
      sinon.stub(Centres, 'findReconciled').returns(Promise.resolve(
        [
          {
            id: 123,
            toJSON: () => {
              return {id: 123}
            }
          }
        ]
      ));
    });

    afterEach(() => {
      Centres.findReconciled.restore();
      Centres.publishUpdate.restore();
    });

    describe('publishUpdateAll', () => {
      it('Should run findReconciled with no args', () => {
        Centres.publishUpdateAll();
        return expect(Centres.findReconciled).to.be.calledWith();
      });

      it('Should publish the update', () => {
        Centres.publishUpdateAll();
        return expect(Centres.publishUpdate).to.be.calledWith(123, {id: 123});
      });
    });

    describe('publishUpdateOne', () => {
      it('Should find a centre given an id', () => {
        Centres.publishUpdateOne(12);
        return expect(Centres.findReconciled).to.be.calledWith({id: 12});
      });

      it('Should find a centre given a centre', () => {
        Centres.publishUpdateOne({id: 12});
        return expect(Centres.findReconciled).to.be.calledWith({id: 12});
      });

      it('Should publish the update', () => {
        Centres.publishUpdateOne(12);
        return expect(Centres.publishUpdate).to.be.calledWith(123, {id: 123});
      });
    });
  });

  describe('findReconciled', () => {
    var populate, map;
    var dummyMovement = [{id: 1}, {id: 2}, {id: 3}];
    var dummyPrebooking = [{id: 4}, {id: 5}, {id: 6}];
    var dummyContingency = [{id: 7}, {id: 8}, {id: 9}];

    beforeEach(() => {
      populate = sinon.stub().returnsThis();
      map = sinon.stub().returnsThis();
      sinon.stub(Centres, 'find').returns({
        populate: populate,
        then: sinon.stub().resolves(true),
        map: map,
        toPromise: sinon.stub().returnsThis()
      });
    });

    afterEach(() => Centres.find.restore());

    it('Should populate female_prebooking', () =>
      model.findReconciled()
        .then(() => expect(populate).to.be.calledWith('female_prebooking'))
    );

    it('Should populate male_prebooking', () =>
      model.findReconciled()
        .then(() => expect(populate).to.be.calledWith('male_prebooking'))
    );

    it('Should populate female_contingency', () =>
      model.findReconciled()
        .then(() => expect(populate).to.be.calledWith('female_contingency'))
    );

    it('Should populate male_contingency', () =>
      model.findReconciled()
        .then(() => expect(populate).to.be.calledWith('male_contingency'))
    );

    it('Should perform reconciliation', () =>
      model.findReconciled()
        .then(() => expect(map).to.be.calledWith(BedCountService.performConfiguredReconciliation))
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
  it('should on destroy, destroy orphaned prebookings', () =>
    Centres.destroy()
      .then(() => expect(Prebooking.find()).to.eventually.have.length(0))
  );
  it('should on destroy, destroy orphaned movements', () =>
    Centres.destroy()
      .then(() => expect(Movement.find()).to.eventually.have.length(0))
  );
  it('should on destroy, destroy orphaned events', () =>
    Centres.destroy()
      .then(() => expect(Event.find()).to.eventually.have.length(0))
  );
  it('should on destroy, destroy orphaned beds', () =>
    Centres.destroy()
      .then(() => expect(Bed.find()).to.eventually.have.length(0))
  );
  it('should on destroy, destroy orphaned detainee', () =>
    Centres.destroy()
      .then(() => expect(Detainee.find()).to.eventually.have.length(0))
  );
});
