"use strict";
var jhg = require('../../helpers/JsonHelperGenerator');
var ValidationError = require('../../../api/lib/exceptions/ValidationError');
var controller = require('../../../api/controllers/Depmu_EntryController');
var moment = require('moment-timezone');
moment.tz.setDefault("Europe/London");

var validTimestamp = moment().set({hour: 7, minute: 0, second: 0}).format();
var pastTimestamp = moment(validTimestamp).subtract(1, 'millisecond').format();
var futureTimestamp = moment(validTimestamp).add(1, 'day').format();

describe('UNIT Depmu_EntryController', () => {
  var res;

  beforeEach(() => {
    res = {
      ok: sinon.stub()
    };

    sinon.stub(Prebooking, 'create').resolves({foo: 'bar'});
    sinon.stub(Centres, 'getGenderAndCentreByCIDLocation').resolves({bar: 'raa'});
  });

  afterEach(() => {
    Prebooking.create.restore();
    Centres.getGenderAndCentreByCIDLocation.restore();
  });

  describe('prebookingOptions', () => {
    it('should pass the schema to res.ok', () => {
      controller.prebookingOptions(null, res);
      expect(res.ok).to.be.calledWith(DepmuEntryPrebookingValidatorService.schema);
    });
  });

  describe('formatPrebooking', () => {
    var dummyPrebooking = {
      "cid_id": '134',
      "location": ' EXAMPLE 1 ',
      "task_force": ' EXAMPLE 2 '
    };

    it('should make the prebooking location lowercase and trimmed', () =>
      expect(controller.formatPrebooking(dummyPrebooking)["location"]).to.eql('example 1')
    );

    it('should make the prebooking task force  lowercase and trimmed', () =>
      expect(controller.formatPrebooking(dummyPrebooking)["task_force"]).to.eql('example 2')
    );

    it('should make the prebooking cid an integer', () =>
      expect(controller.formatPrebooking(dummyPrebooking)["cid_id"]).to.eql(134)
    );

    it('should make the prebooking cid null if undefined', () => {
      var dummyPrebooking = {
        "cid_id": '',
        "location": ' EXAMPLE 1 ',
        "task_force": ' EXAMPLE 2 '
      };
      expect(controller.formatPrebooking(dummyPrebooking)["cid_id"]).to.eql(null)

    });
  });

  describe('populatePrebookingsWithCentreAndGender', () => {
    var dummyPrebooking = {
      "location": "example"
    };

    it('should pass the correct mapping to Centre.getGenderAndCentreByCIDLocation', () => {
        controller.populatePrebookingWithCentreAndGender(dummyPrebooking);
        return expect(Centres.getGenderAndCentreByCIDLocation).to.be.calledWith("example");
      }
    );

    it('should merge the result into the response', () =>
      expect(controller.populatePrebookingWithCentreAndGender(dummyPrebooking)).to.eventually.eql({
        "location": "example",
        "bar": "raa"
      })
    );
  });

  describe('populatePrebookingWithContingency', () => {
    var dummyPrebooking;

    it('should merge the result into the response', () => {
      dummyPrebooking = {
        "cid_id": 123,
        "task_force": "htu"
      };
      expect(controller.populatePrebookingWithContingency(dummyPrebooking)).to.eql({
        "cid_id": 123,
        "task_force": "htu",
        "contingency": true
      })
    });

    it('should set contingency as false for a prebooking Task Force', () => {
      dummyPrebooking.task_force = 'ops1';
      expect(controller.populatePrebookingWithContingency(dummyPrebooking)["contingency"]).to.eql(false)
    });

    it('should set contingency as true for htu Task Force', () => {
      dummyPrebooking.task_force = 'htu';
      expect(controller.populatePrebookingWithContingency(dummyPrebooking)["contingency"]).to.eql(true)
    });

    it('should set contingency as true for depmu Task Force', () => {
      dummyPrebooking.task_force = 'depmu';
      expect(controller.populatePrebookingWithContingency(dummyPrebooking)["contingency"]).to.eql(true)
    });

    it('should set contingency as true for htu as the prefix for a Task Force', () => {
      dummyPrebooking.task_force = 'htu other';
      expect(controller.populatePrebookingWithContingency(dummyPrebooking)["contingency"]).to.eql(true)
    });

    it('should set contingency as true for depmu as the prefix for a Task Force', () => {
      dummyPrebooking.task_force = 'depmu other';
      expect(controller.populatePrebookingWithContingency(dummyPrebooking)["contingency"]).to.eql(true)
    });
  });

  describe('filterNonEmptyPrebookings', () => {
    it('should leave in non-empty prebookings', () =>
      expect(controller.filterNonEmptyPrebookings({
        centre: 'abc',
        gender: 'male',
        task_force: 'ops1',
        timestamp: validTimestamp
      })).to.be.ok
    );

    it('should remove any prebooking that does not have a valid gender, timestamp, and task force', () =>
      expect(controller.filterNonEmptyPrebookings({centre: 'abc'})).to.not.be.ok
    );

    it('should remove any prebooking that does not have a valid centre, timestamp, and gender', () =>
      expect(controller.filterNonEmptyPrebookings({task_force: 'ops1'})).to.not.be.ok
    );

    it('should remove any prebooking that does not have a valid centre, timestamp, gender and task force', () =>
      expect(controller.filterNonEmptyPrebookings({cid_id: 123})).to.not.be.ok
    );
  });

  describe('filterCurrentRangePrebookings', () => {
    it('should leave in todays prebookings', () =>
      expect(controller.filterCurrentRangePrebookings({timestamp: validTimestamp})).to.be.true
    );

    it('should remove any prebooking that is dated tomorrow', () =>
      expect(controller.filterCurrentRangePrebookings({timestamp: futureTimestamp})).to.be.false
    );

    it('should remove any prebooking that dated yesterday', () =>
      expect(controller.filterCurrentRangePrebookings({timestamp: pastTimestamp})).to.be.false
    );
  });

  describe('filterPrebookingsWithNoMovementOrder', () => {
    var dummyPrebooking = {cid_id: 4, centre: 'abc'};
    var dummyMovement = {
      centre: 2,
      detainee: 3,
      id: 2,
      active: true
    };
    var dummyDetainee = {
      "id": 3,
      "gender": "male",
      "cid_id": 312
    };

    it('should filter movements without a populated detainee', () =>
      Movement.create(dummyMovement)
        .then(() => controller.filterPrebookingsWithNoMovementOrder(dummyPrebooking))
        .then(result => expect(result).to.be.true)
    );

    it('should filter movements with a populated detainee and a non-matching cid_id', () =>
      Movement.create(dummyMovement)
        .then(() => Detainee.create(dummyDetainee))
        .then(() => controller.filterPrebookingsWithNoMovementOrder(dummyPrebooking))
        .then(result => expect(result).to.be.true)
    );

    it('should not filter movements with a populated detainee and a matching cid_id', () => {
      dummyDetainee.cid_id = 4;
      return Movement.create(dummyMovement)
        .then(() => Detainee.create(dummyDetainee))
        .then(() => controller.filterPrebookingsWithNoMovementOrder(dummyPrebooking))
        .then(result => expect(result).to.be.false)

    });

    it('should eventually resolve with the prebookings if prebooking has no cid id', () => {
        var dummyPrebooking = {cid_id: null, centre: 'abc'};
        expect(controller.filterPrebookingsWithNoMovementOrder(dummyPrebooking)).to.equal(true);
      }
    );
  });

  describe('updateReceivedDate', () => {
    it('should eventually resolve with the prebookings', () =>
      expect(controller.updateReceivedDate()).to.eventually.resolve
    );
  });

  describe('prebookingPost', () => {
    let res, req, context, validationservice;
    beforeEach(() => {
      validationservice = global.DepmuEntryPrebookingValidatorService;

      req = {
        body: {
          Output: [{
            "location": 'bigone male holding',
            "timestamp": validTimestamp,
            "task_force": 'ops1',
            "cid_id": '434'
          }]
        }
      };

      global.DepmuEntryPrebookingValidatorService = {
        validate: sinon.stub().resolves(req.body)
      };

      res = {
        badRequest: sinon.stub(),
        serverError: sinon.stub(),
        ok: sinon.stub()
      };

      context = {
        formatPrebooking: sinon.spy(controller, 'formatPrebooking'),
        populatePrebookingWithContingency: sinon.spy(controller, 'populatePrebookingWithContingency'),
        populatePrebookingWithCentreAndGender: sinon.spy(controller, 'populatePrebookingWithCentreAndGender'),
        filterNonEmptyPrebookings: sinon.spy(controller, 'filterNonEmptyPrebookings'),
        filterCurrentRangePrebookings: sinon.spy(controller, 'filterCurrentRangePrebookings'),
        filterPrebookingsWithNoMovementOrder: sinon.spy(controller, 'filterPrebookingsWithNoMovementOrder'),
        truncatePrebookings: sinon.spy(controller, 'truncatePrebookings'),
        prebookingProcess: sinon.spy(controller, 'prebookingProcess'),
        updateReceivedDate: sinon.spy(controller, 'updateReceivedDate')
      };
      sinon.stub(Centres, 'publishCentreUpdates').resolves();
    });

    afterEach(() => {
      global.DepmuEntryPrebookingValidatorService = validationservice;
      Centres.publishCentreUpdates.restore();
      context.formatPrebooking.restore();
      context.populatePrebookingWithContingency.restore();
      context.populatePrebookingWithCentreAndGender.restore();
      context.filterNonEmptyPrebookings.restore();
      context.filterCurrentRangePrebookings.restore();
      context.filterPrebookingsWithNoMovementOrder.restore();
      context.truncatePrebookings.restore();
      context.prebookingProcess.restore();
      context.updateReceivedDate.restore();
    });

    it('Should validate the req.body', () =>
      controller.prebookingPost.apply(context, [req, res])
        .then(() =>expect(global.DepmuEntryPrebookingValidatorService.validate).to.be.calledWith(req.body))
    )

    it('Should return res.ok', () =>
      controller.prebookingPost.apply(context, [req, res])
        .then(() => expect(res.ok).to.be.calledOnce)
        .catch((e) => {
          expect(context.formatPrebooking).to.have.been.calledOnce.with(req.body.Output);
          expect(context.populatePrebookingWithContingency).to.have.been.calledOnce;
          expect(context.populatePrebookingWithCentreAndGender).to.have.been.calledOnce;
          expect(context.filterNonEmptyPrebookings).to.have.been.calledOnce;
          expect(context.filterCurrentRangePrebookings).to.have.been.calledOnce;
          expect(context.filterPrebookingsWithNoMovementOrder).to.have.been.calledOnce;
          expect(context.truncatePrebookings).to.have.been.calledOnce;
          expect(context.prebookingProcess).to.have.been.calledOnce;
          expect(context.updateReceivedDate).to.have.been.calledOnce;
        })
    );

    it('Should return res.badRequest on validationError', () => {
      const error = new ValidationError('f');
      error.result = {
        errors: [{
          message: 'that is not valid',
          path: 'this guy'
        }]
      };
      global.DepmuEntryPrebookingValidatorService.validate = sinon.stub().rejects(error);
      return controller.prebookingPost.apply(context, [req, res])
        .finally(() =>
          expect(res.badRequest).to.be.calledOnce
        );
    });

    it('Should return res.serverError on validationError', () => {
      global.DepmuEntryPrebookingValidatorService.validate = sinon.stub().rejects('error');
      return controller.prebookingPost.apply(context, [req, res])
        .finally(() => {
            expect(res.serverError).to.be.calledOnce;
            expect(res.ok).to.not.be.called;
          }
        );
    });

    it('Should not return res.ok on error', () => {
      global.DepmuEntryPrebookingValidatorService.validate = sinon.stub().rejects('error');
      return controller.prebookingPost.apply(context, [req, res])
        .finally(() =>
          expect(res.ok).to.not.be.called
        );
    });
  });

  describe('prebookingProcess', () => {
    var dummyPrebooking = {
      "centre": 1,
      "gender": 'female',
      "task_force": 'htu',
      "contingency": true,
      "cid_id": 4
    };
    it('should pass the correct mapping to create', () => {
      controller.prebookingProcess(dummyPrebooking);
      return expect(Prebooking.create).to.be.calledWith(
        {
          "centre": 1,
          "gender": 'female',
          "task_force": 'htu',
          "contingency": true,
          "cid_id": 4
        });
    });

    it('should return create', () =>
      expect(controller.prebookingProcess(dummyPrebooking)).to.eventually.eql(
        {
          "centre": 1,
          "cid_id": 4,
          "gender": 'female',
          "contingency": true,
          "task_force": 'htu'
        })
    );
  });
});
