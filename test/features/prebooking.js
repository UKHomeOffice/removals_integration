'use strict';

moment.tz.setDefault("Europe/London");
Promise = require('bluebird');

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

const andExpect = obj => expect(obj.__flags.object);
let cachedRes;
const checkCentreForPrebooking = (task_force, cid_id, gender, total, res) =>
  (res ? Promise.resolve(res) : request_auth(sails.hooks.http.app).get('/centres').expect(200))
    .then(response =>
      expect((cachedRes = response).body.data).to.be.an('array').that.has.lengthOf(1)
        .with.deep.property('[0].attributes')
    )
    .tap(attrs => andExpect(attrs).to.have.property(gender || 'malePrebooking', total || 1))
    .then(attrs =>
      andExpect(attrs)
        .to.have.property(`${gender || 'malePrebooking'}Detail`)
        .that.is.an('object').that.has.keys([task_force])
        .with.property(task_force).that.is.an('object')
    )
    .tap(taskForce => andExpect(taskForce).to.have.property('total', total || 1))
    .then(taskForce =>
      andExpect(taskForce).to.be.an('object')
        .with.property('cids').that.is.an('array').that.has.lengthOf(1)
        .with.deep.property('[0]').that.is.an('object').that.has.keys(['id', 'cid_id'])
        .with.property('cid_id', parseInt(cid_id))
    );

Feature('Prebooking', function () {
  const centre = {
    name: 'bigone',
    male_capacity: 999,
    female_capacity: 750,
    id: 1,
    male_cid_name: ['bigone male holding', 'smallone male holding'],
    female_cid_name: ['bigone female office', 'smallone female holding']
  };

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
          cid_id: '222'
        }, {
          timestamp: validTimestamp,
          location: 'smallone female holding',
          task_force: 'ops1',
          cid_id: ''
        }, {
          timestamp: validTimestamp,
          location: 'bigone male holding',
          task_force: 'ops1',
          cid_id: ''
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

      Given('there is a single centre', () =>
        Centres.destroy({})
          .then(() => Centres.create(centre))
          .then(() => expect(Centres.find({})).to.eventually.have.lengthOf(1))
      );

      And('it has no prebookings', () => expect(Prebooking.find({})).to.eventually.be.empty);

      And(`a prebooking has already occurred`, () =>
        createRequest(payload, '/depmu_entry/prebooking', 201)
          .then(() => findPrebookingByCID(payload.Output[0].cid_id))
          .then((models) => {
            expect(models.length).to.equal(1);
            expect(models[0].cid_id).to.equal(parseInt(payload.Output[0].cid_id));
          })
      );

      And('the prebooking appears in the centre detail', () =>
        checkCentreForPrebooking(payload.Output[0].task_force, payload.Output[0].cid_id)
      );

      When(`new valid prebookings occur`, () =>
        createRequest(followingPayload, '/depmu_entry/prebooking', 201));

      Then('previous prebookings recorded are removed', () =>
        findPrebookingByCID(payload.Output[0].cid_id).then((models) => expect(models.length).to.equal(0))
      );

      And('the centre shows 2 new male prebookings', () =>
        checkCentreForPrebooking('ops1', followingPayload.Output[3].cid_id, 'malePrebooking', 2)
      );
      And('the centre shows 2 new male prebookings', () =>
        checkCentreForPrebooking('ops1', followingPayload.Output[0].cid_id, 'femalePrebooking', 2, cachedRes)
      );
      And('the centre shows 2 new male and female contingency bookings', () => {
        expect(cachedRes.body.data).to.have.deep.property('[0].attributes.maleContingency', 2);
        expect(cachedRes.body.data).to.have.deep.property('[0].attributes.femaleContingency', 2);
      });
    });

    Scenario('New Invalid Pre-bookings are ignored', () => {
      var invalidPayload = {
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
        global.sails.log.verbose.restore();
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given('there is a single centre', () =>
        Centres.destroy({})
          .then(() => Centres.create(centre))
          .then(() => expect(Centres.find({})).to.eventually.have.lengthOf(1))
      );

      And('it has no prebookings', () => expect(Prebooking.find({})).to.eventually.be.empty);

      And(`a valid prebooking has been received`, () =>
        createRequest(payload, '/depmu_entry/prebooking', 201)
          .then(() => findPrebookingByCID(payload.Output[0].cid_id))
          .then((models) =>
            expect(models).to.be.an('array')
              .that.has.lengthOf(1)
              .with.deep.property('[0].cid_id', parseInt(payload.Output[0].cid_id))
          )
      );

      And('the prebooking appears in the centre detail', () =>
        checkCentreForPrebooking(payload.Output[0].task_force, payload.Output[0].cid_id)
      );

      When(`a new invalid prebooking occurs`, () =>
        createRequest(invalidPayload, '/depmu_entry/prebooking', 400)
      );

      Then('the prebookings remain unchanged', () =>
        checkCentreForPrebooking(payload.Output[0].task_force, payload.Output[0].cid_id)
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

      Given('there is a single centre', () =>
        Centres.destroy({})
          .then(() => Centres.create(centre))
          .then(() => expect(Centres.find({})).to.eventually.have.lengthOf(1))
      );

      And('it has no prebookings', () => expect(Prebooking.find({})).to.eventually.be.empty);

      And('it has no movements', () => expect(Movement.find({})).to.eventually.be.empty);

      And(`a valid prebooking has been received`, () =>
        createRequest(payload, '/depmu_entry/prebooking', 201)
          .then(() => findPrebookingByCID(payload.Output[0].cid_id))
          .then(models =>
            expect(models).to.be.an('array')
              .that.has.lengthOf(1)
              .with.deep.property('[0].cid_id', parseInt(payload.Output[0].cid_id))
          )
      );

      And('the prebooking appears in the centre details', () =>
        request_auth(sails.hooks.http.app)
          .get('/centres')
          .expect(200)
          .toPromise()
          .then(res =>
            expect((this.centres = res.body.data)).to.be.an('array').that.has.lengthOf(1)
              .with.deep.property('[0].attributes.malePrebooking', 1))
      );

      And('the centre\'s `availability` count is reduced', () =>
        expect(this.centres[0].attributes.maleAvailability).to.equal(this.centres[0].attributes.maleCapacity - 1)
      );

      When(`an incoming movement order with a matching CID ID occurs`, () =>
        createRequest(movementOrderPayload, '/cid_entry/movement', 201).then(() =>
          expect(Movement.find({})).to.eventually.be.an('array').that.has.lengthOf(1)
            .with.deep.property('[0].cid_id', parseInt(payload.Output[0].cid_id))
        )
      );

      Then(`the prebooking has been removed`, () =>
        findPrebookingByCID(payload.Output[0].cid_id).then((models) => expect(models.length).to.equal(0))
      );

      And('the prebooking does not appear in the centre details', () =>
        request_auth(sails.hooks.http.app)
          .get('/centres')
          .expect(200)
          .toPromise()
          .then(res =>
            expect((this.centres = res.body.data)).to.be.an('array').that.has.lengthOf(1)
              .with.deep.property('[0].attributes')
          )
          .tap(attrs => andExpect(attrs).to.have.property('malePrebooking', 0))
          .then(attrs =>
            andExpect(attrs)
              .to.have.property('malePrebookingDetail')
              .that.is.an('object').that.is.empty
          )
      );

      And('the centre\'s `availability` count is still reduced', () =>
        expect(this.centres[0].attributes.maleAvailability).to.equal(this.centres[0].attributes.maleCapacity - 1)
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
