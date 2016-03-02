"use strict";
var jhg = require('../../helpers/JsonHelperGenerator');
var ValidationError = require('../../../api/lib/exceptions/ValidationError');
var controller = require('../../../api/controllers/Cid_EntryController');

describe('INTEGRATION Cid_EntryController', () => {

  describe('Movement', () => {
    describe('a valid payload', () => {
      before(() => sinon.stub(Centres, 'update').resolves(true));
      after(() => Centres.update.restore());
      it('should be accepted', () =>
        request_auth(sails.hooks.http.app)
          .post('/cid_entry/movement')
          .send(validdummydata)
          .expect(201)
      );
    })
    describe('isolated verbose log level', () => {
      beforeEach(() => {
        sinon.stub(global.sails.log, 'verbose');
      });
      afterEach(() =>
        global.sails.log.verbose.restore()
      );
      it('should reject an invalid payload', () =>
        request_auth(sails.hooks.http.app)
          .post('/cid_entry/movement')
          .send('invalid data')
          .expect(400)
      );
    });
    describe('good payload', () => {
      beforeEach(() => {
        sinon.stub(Centres, 'update').resolves(true);
        return request_auth(sails.hooks.http.app)
          .post('/cid_entry/movement')
          .send(validdummydata)
      });
      afterEach(() => Centres.update.restore());
      it('should create new active movements found in the payload', () =>
        expect(Movement.find({active: true})).to.eventually.have.length(24)
      );
      it('should mark existing all movements in the payload as active that were previously inactive', () =>
        expect(Movement.findOne(316512)).to.eventually.include({'active': true})
      );
      it('should mark existing all movements not in the payload as inactive', () =>
        expect(Movement.find({active: false})).to.eventually.have.length(3)
      );
    })
    it('should return the schema for an options request', () =>
      request(sails.hooks.http.app)
        .options('/cid_entry/movement')
        .expect(200)
        .expect((res) => expect(res.body.data).to.eql(CidEntryMovementValidatorService.schema))
    );
  });
  describe('pubsub', () => {
    before(() => {
      sinon.stub(Centres, 'publishUpdate');
      sinon.stub(Centres, 'publishAdd');
      sinon.stub(Centres, 'update').resolves(true);
    });
    after(() => {
      Centres.publishUpdate.restore();
      Centres.publishAdd.restore();
      Centres.update.restore();
    });
    it('should push out an update to subscribers watching the centres', () =>
      request_auth(sails.hooks.http.app)
        .post('/cid_entry/movement')
        .send(validdummydata)
        .then(() => expect(Centres.publishAdd).to.be.called)
        .then(() => expect(Centres.publishUpdate).to.be.calledWith(1))
        .then(() => expect(Centres.publishUpdate).to.be.calledWith(2))
        .then(() => expect(Centres.publishUpdate).to.be.calledWith(3))
    );
  });
});

describe('UNIT Cid_EntryController', () => {
  var res;
  before(() => {
    res = {
      ok: sinon.stub()
    };
    sinon.stub(Detainee, 'findAndUpdateOrCreate').resolves({id: 'bar'});
    sinon.stub(Movement, 'findAndUpdateOrCreate').resolves({bar: 'foo'});
    sinon.stub(Movement, 'update').resolves({bar: 'foo'});
    sinon.stub(Centres, 'getGenderAndCentreByCIDLocation').resolves({bar: 'raa'});
    sinon.stub(Centres, 'update').resolves({bar: 'raa'});
  });

  after(() => {
    Movement.findAndUpdateOrCreate.restore();
    Movement.update.restore();
    Detainee.findAndUpdateOrCreate.restore();
    Centres.getGenderAndCentreByCIDLocation.restore();
    Centres.update.restore();
  });

  describe('movementOptions', () => {
    it('should pass the schema to res.ok', () => {
      controller.movementOptions(null, res);
      expect(res.ok).to.be.calledWith(CidEntryMovementValidatorService.schema);
    });
  });

  describe('movementProcess', () => {
    var dummyMovement = {
      "centre": 1,
      "detainee": 2,
      "MO Ref.": 3,
      "CID Person ID": 4,
      "MO In/MO Out": "in"
    };
    it('should pass the correct mapping to findAndUpdateOrCreate', () => {
      controller.movementProcess(dummyMovement);
      return expect(Movement.findAndUpdateOrCreate).to.be.calledWith(dummyMovement['MO Ref.'],
        {
          centre: 1,
          detainee: 2,
          id: 3,
          active: true,
          direction: 'in'
        });
    });
    it('should return findAndUpdateOrCreate', () =>
      expect(controller.movementProcess(dummyMovement)).to.eventually.eql({bar: 'foo'})
    );
  });

  describe('detaineeProcess', () => {
    var dummyMovement = {
      "gender": "male",
      "CID Person ID": 4
    };
    it('should pass the correct mapping to findAndUpdateOrCreate', () => {
      controller.detaineeProcess(dummyMovement);
      return expect(Detainee.findAndUpdateOrCreate).to.be.calledWith(
        {
          cid_id: dummyMovement['CID Person ID']
        },
        {
          cid_id: 4,
          gender: "male"
        });
    });
    it('should return the movement with the detainee added to it', () =>
      expect(controller.detaineeProcess(dummyMovement)).to.eventually.eql({
        "gender": "male",
        "CID Person ID": 4,
        "detainee": "bar"
      })
    );
  });

  describe('formatMovement', () => {
    var dummyMovement = {
      "MO Ref.": "134",
      "MO In/MO Out": " IN "
    };
    it('should make the movement order ref an integer', () =>
      expect(controller.formatMovement(dummyMovement)["MO Ref."]).to.eql(134)
    );
    it('should trim and lower case the direction of the movement', () =>
      expect(controller.formatMovement(dummyMovement)["MO In/MO Out"]).to.eql("in")
    );
  });

  describe('removeNonOccupancy', () => {
    var dummyMovement = {
      "foo": "bar"
    };
    beforeEach(() => sinon.spy(Centres, 'removeNonOccupancy'));
    afterEach(() => Centres.removeNonOccupancy.restore());

    it('should call Centres.removeNonOccupancy', () => {
      controller.removeNonOccupancy(dummyMovement);
      expect(Centres.removeNonOccupancy).to.have.been.called;
    });
    it('should return the movement', () =>
      expect(controller.removeNonOccupancy(dummyMovement)).to.eventually.eql(dummyMovement)
    );
  });

  describe('populateMovementWithCentreAndGender', () => {
    var dummyMovement = {
      "Location": "helloworld"
    };
    it('should pass the correct mapping to Centre.getGenderAndCentreByCIDLocation', () => {
        controller.populateMovementWithCentreAndGender(dummyMovement);
        return expect(Centres.getGenderAndCentreByCIDLocation).to.be.calledWith("helloworld");
      }
    );
    it('should merge the result into the response', () =>
      expect(controller.populateMovementWithCentreAndGender(dummyMovement)).to.eventually.eql({
        "Location": "helloworld",
        "bar": "raa"
      })
    )
  });

  describe('filterNonEmptyMovements', () => {
    it('should leave in non-empty movements', () =>
      expect(controller.filterNonEmptyMovements({centre: 1, "MO Ref.": 2})).to.be.ok
    );
    it('should remove any movement that does not have a valid centre', () =>
      expect(controller.filterNonEmptyMovements({"MO Ref.": 2})).to.not.be.ok
    );
    it('should remove any movement that does not have a valid movement order reference', () =>
      expect(controller.filterNonEmptyMovements({"centre": 1})).to.not.be.ok
    );
  })

  describe('markNonMatchingMovementsAsInactive', () => {
    it('should pass correct mapping to Movement.update', () => {
      controller.markNonMatchingMovementsAsInactive([{id: 1}, {id: 2}, {id: 3}]);
      expect(Movement.update).to.be.calledWith({id: {'not': [1, 2, 3]}}, {active: false});
    });
  });

  describe('updateReceivedDate', () => {
    var dummyMovement = [{id: 1}, {id: 2}, {id: 3}];
    it('should call Centres.update with a new date', () =>
      expect(controller.updateReceivedDate(dummyMovement).then(() =>
        expect(Centres.update).to.have.been.calledOnce
          .and.calledWith({}, {cid_received_date: sinon.match.instanceOf(Date)})))
    );
    it('should eventually resolve with the movements', () =>
      expect(controller.updateReceivedDate(dummyMovement)).to.eventually.eql(dummyMovement)
    );
  });

  describe('publishCentreUpdates', () => {
    var dummyMovement = [{id: 1}, {id: 2}, {id: 3}];
    it('should eventually resolve with the movements', () =>
      expect(controller.publishCentreUpdates(dummyMovement)).to.eventually.eql(dummyMovement)
    );
  });

});

var validdummydata = {
  "Output": [{
    "Location": "bigone male holding",
    "MO In/MO Out": "Out",
    "MO Ref.": "21451651",
    "MO Date": "05/01/2016 09:20:00",
    "MO Type": "Removal",
    "CID Person ID": "123"
  }, {
    "Location": "bigone male holding",
    "MO In/MO Out": "Out",
    "MO Ref.": "2130451",
    "MO Date": "05/01/2016 07:08:00",
    "MO Type": "Occupancy",
    "CID Person ID": "321"
  }, {
    "Location": "bigone male holding",
    "MO In/MO Out": "In",
    "MO Ref.": "316512",
    "MO Date": "05/01/2016 09:00:00",
    "MO Type": "Occupancy",
    "CID Person ID": "213"
  }, {
    "Location": "bigone male holding",
    "MO In/MO Out": "In",
    "MO Ref.": "132023",
    "MO Date": "05/01/2016 09:00:00",
    "MO Type": "Non-Occupancy",
    "CID Person ID": "312"
  }, {
    "Location": "bigone female office",
    "MO In/MO Out": "Out",
    "MO Ref.": "51651230",
    "MO Date": "05/01/2016 09:01:00",
    "MO Type": "Non-Occupancy",
    "CID Person ID": "789"
  }, {
    "Location": "bigone female office",
    "MO In/MO Out": "Out",
    "MO Ref.": "515648",
    "MO Date": "05/01/2016 09:01:00",
    "MO Type": "Occupancy",
    "CID Person ID": "987"
  }, {
    "Location": "bigone female office",
    "MO In/MO Out": "In",
    "MO Ref.": "23161651",
    "MO Date": "05/01/2016 00:01:00",
    "MO Type": "Occupancy",
    "CID Person ID": "879"
  }, {
    "Location": "bigone female office",
    "MO In/MO Out": "In",
    "MO Ref.": "41469849",
    "MO Date": "05/01/2016 00:01:00",
    "MO Type": "Occupancy",
    "CID Person ID": "897"
  }, {
    "Location": "smale one male unit",
    "MO In/MO Out": "In",
    "MO Ref.": "897984561",
    "MO Date": "05/01/2016 00:01:00",
    "MO Type": "Occupancy",
    "CID Person ID": "1234"
  }, {
    "Location": "smale one male unit",
    "MO In/MO Out": "In",
    "MO Ref.": "17192393",
    "MO Date": "05/01/2016 09:26:00",
    "MO Type": "Occupancy",
    "CID Person ID": "4321"
  }, {
    "Location": "small one unit",
    "MO In/MO Out": "In",
    "MO Ref.": "69235141",
    "MO Date": "05/01/2016 00:01:00",
    "MO Type": "Occupancy",
    "CID Person ID": "3421"
  }, {
    "Location": "small one unit",
    "MO In/MO Out": "Out",
    "MO Ref.": "3216579",
    "MO Date": "05/01/2016 00:01:00",
    "MO Type": "Occupancy",
    "CID Person ID": "3241"
  }, {
    "Location": "small one unit",
    "MO In/MO Out": "Out",
    "MO Ref.": "564321897",
    "MO Date": "05/01/2016 07:55:00",
    "MO Type": "Occupancy",
    "CID Person ID": "3214"
  }, {
    "Location": "small one unit",
    "MO In/MO Out": "Out",
    "MO Ref.": "1718293935",
    "MO Date": "05/01/2016 11:35:00",
    "MO Type": "Occupancy",
    "CID Person ID": "2341"
  }, {
    "Location": "small one unit",
    "MO In/MO Out": "In",
    "MO Ref.": "798416549",
    "MO Date": "05/01/2016 08:36:00",
    "MO Type": "Removal",
    "CID Person ID": "3412"
  }, {
    "Location": "small one unit",
    "MO In/MO Out": "In",
    "MO Ref.": "215641",
    "MO Date": "05/01/2016 14:00:00",
    "MO Type": "Removal",
    "CID Person ID": "567890"
  }, {
    "Location": "Canterbury Combined Courts",
    "MO In/MO Out": "Out",
    "MO Ref.": "23156495814",
    "MO Date": "05/01/2016 14:01:00",
    "MO Type": "Occupancy",
    "CID Person ID": "910322"
  }, {
    "Location": "anotherone unit",
    "MO In/MO Out": "In",
    "MO Ref.": "2315614",
    "MO Date": "05/01/2016 00:01:00",
    "MO Type": "Non-Occupancy",
    "CID Person ID": "33136216"
  }, {
    "Location": "anotherone unit",
    "MO In/MO Out": "In",
    "MO Ref.": "216511",
    "MO Date": "05/01/2016 00:01:00",
    "MO Type": "Non-Occupancy",
    "CID Person ID": "798123"
  }, {
    "Location": "anotherone female unit",
    "MO In/MO Out": "In",
    "MO Ref.": "12541561231",
    "MO Date": "05/01/2016 00:01:00",
    "MO Type": "Non-Occupancy",
    "CID Person ID": "6514651"
  }, {
    "Location": "anotherone female unit",
    "MO In/MO Out": "In",
    "MO Ref.": "7897945616",
    "MO Date": "05/01/2016 00:01:00",
    "MO Type": "Occupancy",
    "CID Person ID": "798123"
  }, {
    "Location": "anotherone female unit",
    "MO In/MO Out": "Out",
    "MO Ref.": "3541611",
    "MO Date": "05/01/2016 08:31:00",
    "MO Type": "Removal",
    "CID Person ID": "1645146"
  }, {
    "Location": "anotherone female unit",
    "MO In/MO Out": "Out",
    "MO Ref.": "1469849841",
    "MO Date": "05/01/2016 18:00:00",
    "MO Type": "Occupancy",
    "CID Person ID": "31565"
  }, {
    "Location": "anotherone female unit",
    "MO In/MO Out": "In",
    "MO Ref.": "87984651",
    "MO Date": "05/01/2016 00:01:00",
    "MO Type": "Occupancy",
    "CID Person ID": "1156102"
  }, {
    "Location": "anotherone female unit",
    "MO In/MO Out": "In",
    "MO Ref.": "2345641651",
    "MO Date": "05/01/2016 00:01:00",
    "MO Type": "Occupancy",
    "CID Person ID": "1654651"
  }, {
    "Location": "Doncaster & Bassetlaw Hospitals Nhs Foundation Tru",
    "MO In/MO Out": "In",
    "MO Ref.": "414691461",
    "MO Date": "05/01/2016 09:27:00",
    "MO Type": "Occupancy",
    "CID Person ID": "231650"
  }, {
    "Location": "Eaton House Immigration Service",
    "MO In/MO Out": "Out",
    "MO Ref.": "5645610",
    "MO Date": "05/01/2016 08:44:00",
    "MO Type": "Occupancy",
    "CID Person ID": "21261465"
  }, {
    "Location": "Gatwick South",
    "MO In/MO Out": "In",
    "MO Ref.": "65465121065",
    "MO Date": "05/01/2016 18:00:00",
    "MO Type": "Occupancy",
    "CID Person ID": "2315616"
  }]
};
