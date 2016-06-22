'use strict';

moment.tz.setDefault("Europe/London");

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

Feature('Prebooking', () => {
  var validTimestamp = moment().set({hour: 7, minute: 0, second: 0}).format();
  var pastTimestamp = moment(validTimestamp).subtract(1, 'millisecond').format();
  var futureTimestamp = moment(validTimestamp).add(1, 'day').format();

  var payload = {
    Output: [{
      timestamp: validTimestamp,
      location: 'smallone male holding',
      task_force: 'ops1',
      cid_id: '456'
    }]
  };

  Scenario('Consider Today: 7am - 6:59am', () => {
    Scenario('New Valid Pre-bookings replace existing pre-bookings', () => {

      var followingPayload = {
        Output: [{
          timestamp: validTimestamp,
          location: 'smallone female holding',
          task_force: 'ops1',
          cid_id: '111'
        }, {
          timestamp: validTimestamp,
          location: 'smallone female holding',
          task_force: 'ops1',
          cid_id: '444'
        }, {
          timestamp: validTimestamp,
          location: 'bigone male holding',
          task_force: 'ops1',
          cid_id: '222'
        }, {
          timestamp: validTimestamp,
          location: 'bigone male holding',
          task_force: 'ops1',
          cid_id: '333'
        }, {
          timestamp: validTimestamp,
          location: 'bigone male holding',
          task_force: 'HTU',
          cid_id: '444'
        }, {
          timestamp: validTimestamp,
          location: 'bigone male holding',
          task_force: "HTU Failed RD's",
          cid_id: '555'
        }, {
          timestamp: validTimestamp,
          location: 'smallone female holding',
          task_force: 'HTU Borderforce',
          cid_id: ''
        }, {
          timestamp: validTimestamp,
          location: 'smallone female holding',
          task_force: 'Depmu'
        }]
      };
      var expectedFemaleCentre = 'smallone';
      var expectedMaleCentre = 'bigone';

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
        return global.initializeBarrelsFixtures();
      });

      after(function () {
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given(`a prebooking with cid id "${payload.Output[0].cid_id}" has already occurred`, () =>
        createRequest(payload, '/depmu_entry/prebooking', 201)
          .then(() => findPrebookingByCID(payload.Output[0].cid_id))
          .then((models) => {
            expect(models.length).to.equal(1);
            expect(models[0].cid_id).to.equal(parseInt(payload.Output[0].cid_id));
          })
      );

      When(`new valid prebookings occur`, () =>
        createRequest(followingPayload, '/depmu_entry/prebooking', 201));

      Then('previous prebookings recorded are removed', () =>
        findPrebookingByCID(payload.Output[0].cid_id).then((models) => expect(models.length).to.equal(0))
      );

      And(`new female prebookings are created`, () =>
        Prebooking.find({where: {gender: 'female'}}).then((models) => expect(models.length).to.equal(4))
      );
      And(`new male prebookings are created`, () =>
        Prebooking.find({where: {gender: 'male'}}).then((models) => expect(models.length).to.equal(4))
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

    });

    Scenario('New Invalid Pre-bookings are ignored', () => {
      var followingPayload = {
        Output: [{
          timestamp: validTimestamp,
          location: 'smallone female holding',
          cid_id: '111'
        }]
      };

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
        sinon.stub(global.sails.log, 'verbose');
        return global.initializeBarrelsFixtures();
      });

      after(function () {
        global.sails.log.verbose.restore()
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given(`a prebooking with cid id "${payload.Output[0].cid_id}" has already occurred`, () =>
        createRequest(payload, '/depmu_entry/prebooking', 201)
          .then(() => findPrebookingByCID(payload.Output[0].cid_id))
          .then((models) => {
            expect(models.length).to.equal(1);
            expect(models[0].cid_id).to.equal(parseInt(payload.Output[0].cid_id));
          })
      );

      When(`a new invalid prebooking occurs`, () =>
        createRequest(followingPayload, '/depmu_entry/prebooking', 400));

      Then('previous prebookings recorded are retained', () =>
        findPrebookingByCID(payload.Output[0].cid_id).then((models) => expect(models.length).to.equal(1))
      );

      And(`new invalid prebooking is not created`, () =>
        findPrebookingByCID(followingPayload.cid_id).then((models) => expect(models.length).to.equal(0))
      );

    });

    Scenario('Remove Existing Pre-booking when Movement In Order occurs', () => {
      var validMovementTimestamp = moment().set({hour: 7, minute: 0, second: 0}).format("DD/MM/YYYY HH:mm:ss");
      var movementOrderPayload = {
        Output: [{
          "Location": "bigone male holding",
          "MO In/MO Out": "In",
          "MO Ref.": "1718293935",
          "MO Date": validMovementTimestamp,
          "MO Type": "Occupancy",
          "CID Person ID": payload.Output[0].cid_id
        }]
      };

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
        return global.initializeBarrelsFixtures();
      });

      after(function () {
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given(`a prebooking with cid id "${payload.Output[0].cid_id}" has already occurred`, () =>
        createRequest(payload, '/depmu_entry/prebooking', 201)
          .then(() => findPrebookingByCID(payload.Output[0].cid_id))
          .then((models) => {
            expect(models.length).to.equal(1);
            expect(models[0].cid_id).to.equal(parseInt(payload.Output[0].cid_id));
          })
      );

      When(`a valid movement-in order event with cid id "${movementOrderPayload.Output[0]['CID Person ID']}" occurs`, () =>
        createRequest(movementOrderPayload, '/cid_entry/movement', 201));

      Then(`the prebooking with cid id "${payload.Output[0].cid_id}" is removed`, () =>
        findPrebookingByCID(payload.Output[0].cid_id).then((models) => expect(models.length).to.equal(0))
      );

    });

    Scenario('Ignore Pre-bookings with existing Movement In Order', () => {
      var validTimestamp = moment().set({hour: 7, minute: 0, second: 0}).format("DD/MM/YYYY HH:mm:ss");
      var movementOrderPayload = {
        Output: [{
          "Location": "smallone male holding",
          "MO In/MO Out": "In",
          "MO Ref.": "1718293935",
          "MO Date": validTimestamp,
          "MO Type": "Occupancy",
          "CID Person ID": payload.Output[0].cid_id
        }]
      };

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
        sinon.stub(global.sails.log, 'verbose');
        return global.initializeBarrelsFixtures();
      });

      after(function () {
        global.sails.log.verbose.restore()
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given(`a Movement-In order with cid id "${payload.Output[0].cid_id}" has already occurred`, () =>
        createRequest(movementOrderPayload, '/cid_entry/movement', 201)
          .then(() => findMovementByCID(payload.Output[0].cid_id))
          .then((models) => expect(models.length).to.equal(1))
      );

      When(`a valid prebooking with cid id "${payload.Output[0].cid_id}" occurs`, () =>
        createRequest(payload, '/depmu_entry/prebooking', 422));

      Then(`the prebooking with cid id "${payload.Output[0].cid_id}" is ignored`, () =>
        findPrebookingByCID(payload.Output[0].cid_id).then((models) => expect(models.length).to.equal(0))
      );

    });
  });

  Scenario('Ignore Future Prebookings: Post 6:59:59am Tomorrow', () => {
    Scenario('All items in payload refer to past and future only', () => {
      var followingPayload = {
        Output: [{
          timestamp: futureTimestamp,
          location: 'smallone female holding',
          task_force: 'ops1',
          cid_id: '444'
        }, {
          timestamp: pastTimestamp,
          location: 'smallone female holding',
          task_force: 'ops1',
          cid_id: '555'
        }]
      };

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
        sinon.stub(global.sails.log, 'verbose');
        return global.initializeBarrelsFixtures();
      });

      after(function () {
        global.sails.log.verbose.restore()
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given(`a prebooking with cid id "${payload.Output[0].cid_id}" has already occurred`, () =>
        createRequest(payload, '/depmu_entry/prebooking', 201)
          .then(() => findPrebookingByCID(payload.Output[0].cid_id))
          .then((models) => {
            expect(models.length).to.equal(1);
            expect(models[0].cid_id).to.equal(parseInt(payload.Output[0].cid_id));
          })
      );

      When(`new prebookings with timestamps not for today occur`, () =>
        createRequest(followingPayload, '/depmu_entry/prebooking', 422));

      Then(`the new prebooking will not be considered and old prebookings are retained`, () =>
        findPrebookingByCID(payload.Output[0].cid_id).then((models) => expect(models.length).to.equal(1))
      );
    });

    Scenario('Not all items in payload refer to past and future', () => {
      var followingPayload = {
        Output: [{
          timestamp: futureTimestamp,
          location: 'smallone female holding',
          task_force: 'ops1',
          cid_id: '444'
        }, {
          timestamp: pastTimestamp,
          location: 'smallone female holding',
          task_force: 'ops1',
          cid_id: '444'
        }, {
          timestamp: validTimestamp,
          location: 'smallone female holding',
          task_force: 'ops1',
          cid_id: '555'
        }]
      };

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
        return global.initializeBarrelsFixtures();
      });

      after(function () {
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given(`a prebooking with cid id "${payload.Output[0].cid_id}" has already occurred`, () =>
        createRequest(payload, '/depmu_entry/prebooking', 201)
          .then(() => findPrebookingByCID(payload.Output[0].cid_id))
          .then((models) => {
            expect(models.length).to.equal(1);
            expect(models[0].cid_id).to.equal(parseInt(payload.Output[0].cid_id));
          })
      );

      When(`new prebookings with past, future and present timestamps occur`, () =>
        createRequest(followingPayload, '/depmu_entry/prebooking', 201));

      Then(`the new prebooking with timestamp "${followingPayload.Output[0].timestamp}" is not considered`, () =>
        findPrebookingByCID(followingPayload.Output[0].cid_id).then((models) => expect(models.length).to.equal(0))
      );

      And(`the new prebooking with timestamp "${followingPayload.Output[1].timestamp}" is not considered`, () =>
        findPrebookingByCID(followingPayload.Output[1].cid_id).then((models) => expect(models.length).to.equal(0))
      );

      And(`the new prebooking with timestamp "${followingPayload.Output[2].timestamp}" is considered`, () =>
        findPrebookingByCID(followingPayload.Output[2].cid_id).then((models) => expect(models.length).to.equal(1))
      );
    });
  });
});
