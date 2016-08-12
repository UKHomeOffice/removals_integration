'use strict';

moment.tz.setDefault("Europe/London");
const centre = {
  name: 'bigone',
  male_capacity: 999,
  female_capacity: 750,
  id: 1,
  male_cid_name: ['bigone male holding', 'smallone male holding'],
  female_cid_name: ['bigone female office', 'smallone female holding']
};

var findPrebookingByCID = (cid_id) =>
  Prebooking.find({
    where: {
      cid_id: cid_id
    }
  });

var findMovementByCID = (cid_id) =>
  Movement.find({active: true, direction: 'in', cid_id: cid_id})
    .toPromise()
    .filter(movement => Boolean(movement));

describe('Prebooking', () => {
  var validTimestamp = moment().set({hour: 7, minute: 0, second: 0}).format();
  var pastTimestamp = moment(validTimestamp).subtract(1, 'millisecond').format();
  var futureTimestamp = moment(validTimestamp).add(1, 'day').format();

  var payload = {
    cDataSet: [{
      timestamp: validTimestamp,
      location: 'smallone male holding',
      task_force: 'ops1',
      cid_id: 456
    }]
  };

  Scenario('Consider Today: 7am - 6:59am', () => {
    Scenario('New Valid Pre-bookings replace existing pre-bookings', () => {

      var followingPayload = {
        cDataSet: [{
          timestamp: validTimestamp,
          location: 'smallone female holding',
          task_force: 'ops1',
          cid_id: 111
        }, {
          timestamp: validTimestamp,
          location: 'smallone female holding',
          task_force: 'ops1',
          cid_id: 444
        }, {
          timestamp: validTimestamp,
          location: 'bigone male holding',
          task_force: 'ops3',
          cid_id: 222
        }, {
          timestamp: validTimestamp,
          location: 'bigone male holding',
          task_force: 'ops4',
          cid_id: 333
        }, {
          timestamp: validTimestamp,
          location: 'bigone male holding',
          task_force: 'ops4'
        }, {
          timestamp: validTimestamp,
          location: 'bigone male holding',
          task_force: 'HTU'
        }, {
          timestamp: validTimestamp,
          location: 'bigone male holding',
          task_force: "HTU Failed RDs"
        }, {
          timestamp: validTimestamp,
          location: 'smallone female holding',
          task_force: 'HTU Borderforce'
        }, {
          timestamp: validTimestamp,
          location: 'smallone female holding',
          task_force: 'Depmu'
        }]
      };

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
      });

      after(function () {
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given('there is a single centre', () =>
        Centres.destroy({})
          .then(() => Centres.create(centre))
          .then(() => expect(Centres.find({})).to.eventually.have.lengthOf(1))
      );

      And(`a prebooking with cid id "${payload.cDataSet[0].cid_id}" has already occurred`, () =>
        createRequest(payload, '/depmu_entry/prebooking', 201)
          .then(() => findPrebookingByCID(payload.cDataSet[0].cid_id))
          .then((models) => {
            expect(models.length).to.equal(1);
            expect(models[0].cid_id).to.equal(parseInt(payload.cDataSet[0].cid_id));
          })
      );

      When(`new valid prebookings occur`, () =>
        createRequest(followingPayload, '/depmu_entry/prebooking', 201));

      Then('previous prebookings recorded are removed', () =>
        findPrebookingByCID(payload.cDataSet[0].cid_id).then((models) => expect(models.length).to.equal(0))
      );

      And(`new female prebookings are created`, () =>
        Prebooking.find({where: {gender: 'female'}}).then((models) => expect(models.length).to.equal(4))
      );

      And(`new male prebookings are created`, () =>
        Prebooking.find({
          where: {
            gender: 'male',
            contingency: false
          }
        }).then((models) => expect(models.length).to.equal(3))
      );

      And(`new female contingency bookings are created`, () =>
        Prebooking.find({
          where: {
            gender: 'female',
            contingency: true
          }
        }).then((models) => expect(models.length).to.equal(2))
      );

      And(`new male contingency bookings are created`, () =>
        Prebooking.find({
          where: {
            gender: 'male',
            contingency: true
          }
        }).then((models) => expect(models.length).to.equal(2))
      );

      And("the centre's female `contingency` object should include the new bookings", () =>
        assertCentresHTTPResponse('femaleContingencyDetail', {'htu borderforce': 1, 'depmu': 1})
      );

      And("the centre's male `contingency` object should include the new bookings", () =>
        assertCentresHTTPResponse('maleContingencyDetail', {'htu': 1, "htu failed rds": 1})
      );

      And("the centre's female `prebooking` object should include the new bookings", () =>
        assertCentresHTTPResponse('femalePrebookingDetail', {'111': 1, '444': 1})
      );

      And("the centre's male `prebooking` object should include the new bookings", () =>
        assertCentresHTTPResponse('malePrebookingDetail', {'222': 1, '333': 1, 'ops4': 1})
      );
    });

    Scenario('New Invalid Pre-bookings are ignored', () => {
      var followingPayload = {
        cDataSet: [{
          timestamp: validTimestamp,
          location: 'smallone female holding',
          cid_id: 111
        }]
      };

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
      });

      after(function () {
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given('there is a single centre', () =>
        Centres.destroy({})
          .then(() => Centres.create(centre))
          .then(() => expect(Centres.find({})).to.eventually.have.lengthOf(1))
      );

      And(`a prebooking with cid id "${payload.cDataSet[0].cid_id}" has already occurred`, () =>
        createRequest(payload, '/depmu_entry/prebooking', 201)
          .then(() => findPrebookingByCID(payload.cDataSet[0].cid_id))
          .then((models) => {
            expect(models.length).to.equal(1);
            expect(models[0].cid_id).to.equal(parseInt(payload.cDataSet[0].cid_id));
          })
      );

      When(`a new invalid prebooking occurs`, () =>
        createRequest(followingPayload, '/depmu_entry/prebooking', 400));

      Then('previous prebookings recorded are retained', () =>
        findPrebookingByCID(payload.cDataSet[0].cid_id).then((models) => expect(models.length).to.equal(1))
      );

      And("the centre's male `prebooking` object should include the old bookings", () =>
        assertCentresHTTPResponse('malePrebookingDetail', {'456': 1})
      );

      And(`new invalid prebooking is not created`, () =>
        findPrebookingByCID(followingPayload.cid_id).then((models) => expect(models.length).to.equal(0))
      );

      And("the centre's female `prebooking` object should not include the new invalid bookings", () =>
        assertCentresHTTPResponse('femalePrebookingDetail', {})
      );
    });

    Scenario('Remove Existing Pre-booking when Movement In Order occurs', () => {
      var validMovementTimestamp = moment().set({hour: 7, minute: 0, second: 0}).format("DD/MM/YYYY HH:mm:ss");
      var movementOrderPayload = {
        cDataSet: [{
          "Location": "bigone male holding",
          "MO In/MO Out": "In",
          "MO Ref": 1718293935,
          "MO Date": validMovementTimestamp,
          "MO Type": "Occupancy",
          "CID Person ID": payload.cDataSet[0].cid_id
        }]
      };

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
      });

      after(function () {
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given('there is a single centre', () =>
        Centres.destroy({})
          .then(() => Centres.create(centre))
          .then(() => expect(Centres.find({})).to.eventually.have.lengthOf(1))
      );

      And(`a prebooking with cid id "${payload.cDataSet[0].cid_id}" has already occurred`, () =>
        createRequest(payload, '/depmu_entry/prebooking', 201)
          .then(() => findPrebookingByCID(payload.cDataSet[0].cid_id))
          .then((models) => {
            expect(models.length).to.equal(1);
            expect(models[0].cid_id).to.equal(parseInt(payload.cDataSet[0].cid_id));
          })
      );

      When(`a valid movement-in order event with cid id "${movementOrderPayload.cDataSet[0]['CID Person ID']}" occurs`, () =>
        createRequest(movementOrderPayload, '/cid_entry/movement', 201));

      Then(`the prebooking with cid id "${payload.cDataSet[0].cid_id}" is removed`, () =>
        findPrebookingByCID(payload.cDataSet[0].cid_id).then((models) => expect(models.length).to.equal(0))
      );

      And("the centre's female `prebooking` object should be updated", () =>
        assertCentresHTTPResponse('femalePrebookingDetail', {})
      );
    });

    Scenario('Ignore Pre-bookings with existing Movement In Order', () => {
      var validTimestamp = moment().set({hour: 7, minute: 0, second: 0}).format("DD/MM/YYYY HH:mm:ss");
      var movementOrderPayload = {
        cDataSet: [{
          "Location": "smallone male holding",
          "MO In/MO Out": "In",
          "MO Ref": 1718293935,
          "MO Date": validTimestamp,
          "MO Type": "Occupancy",
          "CID Person ID": payload.cDataSet[0].cid_id
        }]
      };

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
      });

      after(function () {
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given('there is a single centre', () =>
        Centres.destroy({})
          .then(() => Centres.create(centre))
          .then(() => expect(Centres.find({})).to.eventually.have.lengthOf(1))
      );

      And(`a Movement-In order with cid id "${payload.cDataSet[0].cid_id}" has already occurred`, () =>
        createRequest(movementOrderPayload, '/cid_entry/movement', 201)
          .then(() => findMovementByCID(payload.cDataSet[0].cid_id))
          .then((models) => expect(models.length).to.equal(1))
      );

      When(`a valid prebooking with cid id "${payload.cDataSet[0].cid_id}" occurs`, () =>
        createRequest(payload, '/depmu_entry/prebooking', 422));

      Then(`the prebooking with cid id "${payload.cDataSet[0].cid_id}" is ignored`, () =>
        findPrebookingByCID(payload.cDataSet[0].cid_id).then((models) => expect(models.length).to.equal(0))
      );

      And("the centre's female `prebooking` object remains unchanged", () =>
        assertCentresHTTPResponse('femalePrebookingDetail', {})
      );
    });
  });

  Scenario('Ignore Future Prebookings: Post 6:59:59am Tomorrow', () => {
    Scenario('All items in payload refer to past and future only', () => {
      var followingPayload = {
        cDataSet: [{
          timestamp: futureTimestamp,
          location: 'smallone female holding',
          task_force: 'ops1',
          cid_id: 444
        }, {
          timestamp: pastTimestamp,
          location: 'smallone female holding',
          task_force: 'ops1',
          cid_id: 555
        }]
      };

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
      });

      after(function () {
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given('there is a single centre', () =>
        Centres.destroy({})
          .then(() => Centres.create(centre))
          .then(() => expect(Centres.find({})).to.eventually.have.lengthOf(1))
      );

      And(`a prebooking with cid id "${payload.cDataSet[0].cid_id}" has already occurred`, () =>
        createRequest(payload, '/depmu_entry/prebooking', 201)
          .then(() => findPrebookingByCID(payload.cDataSet[0].cid_id))
          .then((models) => {
            expect(models.length).to.equal(1);
            expect(models[0].cid_id).to.equal(parseInt(payload.cDataSet[0].cid_id));
          })
      );

      When(`new prebookings with timestamps not for today occur`, () =>
        createRequest(followingPayload, '/depmu_entry/prebooking', 422));

      Then(`the new prebooking will not be considered and old prebookings are retained`, () =>
        findPrebookingByCID(payload.cDataSet[0].cid_id).then((models) => expect(models.length).to.equal(1))
      );

      And("the centre's male `prebooking` object includes details of old prebookings", () =>
        assertCentresHTTPResponse('malePrebookingDetail', {'456': 1})
      );
    });

    Scenario('Not all items in payload refer to past and future', () => {
      var followingPayload = {
        cDataSet: [{
          timestamp: futureTimestamp,
          location: 'smallone female holding',
          task_force: 'ops1',
          cid_id: 444
        }, {
          timestamp: pastTimestamp,
          location: 'smallone female holding',
          task_force: 'ops1',
          cid_id: 444
        }, {
          timestamp: validTimestamp,
          location: 'smallone female holding',
          task_force: 'ops1',
          cid_id: 555
        }]
      };

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
      });

      after(function () {
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given('there is a single centre', () =>
        Centres.destroy({})
          .then(() => Centres.create(centre))
          .then(() => expect(Centres.find({})).to.eventually.have.lengthOf(1))
      );

      And(`a prebooking with cid id "${payload.cDataSet[0].cid_id}" has already occurred`, () =>
        createRequest(payload, '/depmu_entry/prebooking', 201)
          .then(() => findPrebookingByCID(payload.cDataSet[0].cid_id))
          .then((models) => {
            expect(models.length).to.equal(1);
            expect(models[0].cid_id).to.equal(parseInt(payload.cDataSet[0].cid_id));
          })
      );

      When(`new prebookings with past, future and present timestamps occur`, () =>
        createRequest(followingPayload, '/depmu_entry/prebooking', 201));

      Then(`the new prebooking with timestamp "${followingPayload.cDataSet[0].timestamp}" is not considered`, () =>
        findPrebookingByCID(followingPayload.cDataSet[0].cid_id).then((models) => expect(models.length).to.equal(0))
      );

      And(`the new prebooking with timestamp "${followingPayload.cDataSet[1].timestamp}" is not considered`, () =>
        findPrebookingByCID(followingPayload.cDataSet[1].cid_id).then((models) => expect(models.length).to.equal(0))
      );

      And(`the new prebooking with timestamp "${followingPayload.cDataSet[2].timestamp}" is considered`, () =>
        findPrebookingByCID(followingPayload.cDataSet[2].cid_id).then((models) => expect(models.length).to.equal(1))
      );

      And(`the centre's male 'prebooking' object should only include "${followingPayload.cDataSet[2].timestamp}"`, () =>
        assertCentresHTTPResponse('malePrebookingDetail', {})
      );
    });
  });
});
