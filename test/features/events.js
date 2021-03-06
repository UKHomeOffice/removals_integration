'use strict';

const Event2 = require('../../api/models/Event');

describe('Check In Event', () => {

  Scenario('Reject duplications with 208', () => {

    before(function () {
      global.testConfig.initializeBarrelsFixtures = false;
      return global.initializeBarrelsFixtures();
    });

    after(function () {
      global.testConfig.initializeBarrelsFixtures = true;
    });
    var date = new Date(923423234);
    var dateString = date.toISOString();
    const payload = {
      person_id: 123,
      cid_id: 999,
      operation: 'check in',
      timestamp: dateString,
      gender: 'm',
      nationality: 'gbr',
      centre: 'bigone'
    };
    Given('I send a check in', () =>
      request(sails.hooks.http.app)
        .post('/irc_entry/event')
        .send(payload)
        .expect(201)
    )
    Then('I send another check in', () =>
      request(sails.hooks.http.app)
        .post('/irc_entry/event')
        .send(payload)
        .expect(208)
    )

  })

  Scenario('Non-Existent Event should be Created', () => {

    var date = new Date(923423234);
    var dateString = date.toISOString();
    var payload = {
      person_id: 123,
      cid_id: 999,
      operation: 'check in',
      timestamp: dateString,
      gender: 'm',
      nationality: 'gbr',
      centre: 'bigone'
    };

    before(function () {
      global.testConfig.initializeBarrelsFixtures = false;
    });

    after(function () {
      global.testConfig.initializeBarrelsFixtures = true;
    });

    Given('a detainee event with timestamp `' + dateString + '` has not already occurred', () =>

      global.initializeBarrelsFixtures()
        .then(() =>
          Event.find({
            where: {
              timestamp: dateString,
              operation: 'check in'
            }
          }).then((models) =>
            expect(models.length).to.equal(0)
          )
        )
    );

    When('a valid detainee event with timestamp `' + dateString + '` occurs', () =>

      request(sails.hooks.http.app)
        .post('/irc_entry/event')
        .send(payload)
        .expect(201)
    );

    Then('an event with specific timestamp `' + dateString + '` is created from the detainee event received', () =>

      Event.find({
        where: {
          timestamp: dateString,
          operation: 'check in',
          centre: 1
        }
      }).then((models) => expect(models.length).to.equal(1))
    );

  });

  Scenario('Event should be created', () => {

    var date = new Date();
    var dateString = date.toISOString();
    var payload = {
      person_id: 123,
      cid_id: 100,
      operation: 'check in',
      timestamp: dateString,
      gender: 'm',
      nationality: 'gbr',
      centre: 'bigone'
    };

    before(function () {
      global.testConfig.initializeBarrelsFixtures = false;
    });

    after(function () {
      global.testConfig.initializeBarrelsFixtures = true;
    });

    var createEvent = () =>
      request(sails.hooks.http.app)
        .post('/irc_entry/event')
        .send(payload)
        .expect(201);

    Given('a detainee event with timestamp `' + dateString + '` has already occurred', () =>

      global.initializeBarrelsFixtures()
        .then(() => createEvent())
        .then(() => Event.find({
            where: {
              timestamp: dateString,
              operation: 'check in'
            }
          }).then((models) => expect(models.length).to.equal(1))
        )
    );

  });

  Scenario('Existing Detainee Should Be Updated From Check In Operation That Occurred After The Detainee Creation', () => {

    before(function () {
      global.testConfig.initializeBarrelsFixtures = false;
    });

    after(function () {
      global.testConfig.initializeBarrelsFixtures = true;
    });

    var eventUpdateDateString = (new Date(20000)).toISOString();
    var detaineeUpdateDateString = (new Date(10000)).toISOString();

    var payload = {
      person_id: 123,
      cid_id: 4321,
      operation: 'check in',
      timestamp: eventUpdateDateString,
      gender: 'f',
      nationality: 'gbr',
      centre: 'bigone'
    };

    var detaineeAttrs = {
      person_id: 123,
      cid_id: 1234,
      centre: 1,
      gender: 'male',
      operation: 'check in',
      timestamp: detaineeUpdateDateString
    }

    var getSearchResult = () => Detainee.find({
      centre: detaineeAttrs.centre,
      person_id: detaineeAttrs.person_id
    });

    Given('a Detainee already exists with person id `' + detaineeAttrs.person_id + '` from centre `' + detaineeAttrs.centre + '`', () =>

      global.initializeBarrelsFixtures()
        .then(() => Detainee.create(detaineeAttrs))
        .then(() => getSearchResult())
        .then((models) => {
          expect(models).to.have.length(1);
          expect(models[0].gender).to.equal(detaineeAttrs.gender);
          return expect(models[0].cid_id).to.equal(detaineeAttrs.cid_id);
        })
    );

    And('the time of the event timestamp `' + payload.timestamp + '` is later than the existing Detainee creation timestamp `' + detaineeAttrs.timestamp + '`', () =>
      expect(payload.timestamp).to.be.above(detaineeAttrs.timestamp)
    );

    When('a valid detainee event from centre `' + payload.centre + '` with person id `' + payload.person_id + '` occurs', () =>
      request(sails.hooks.http.app)
        .post('/irc_entry/event')
        .send(payload)
        .expect(201)
    );

    Then('the existing detainee is updated from the check in event received', () =>
      getSearchResult().then((models) => {
        expect(models).to.have.length(1);
        expect(models[0].gender).to.equal(Detainee.normalizeGender(payload.gender));
        expect(models[0].cid_id).to.equal(payload.cid_id);
      })
    );

  });

  Scenario('Existing Detainee Should Not Be Updated From Check In Operation That Occurred Before The Detainee Creation', () => {

    before(function () {
      global.testConfig.initializeBarrelsFixtures = false;
    });

    after(function () {
      global.testConfig.initializeBarrelsFixtures = true;
    });

    var eventUpdateDateString = (new Date(10000)).toISOString();
    var detaineeUpdateDateString = (new Date(20000)).toISOString();

    var payload = {
      person_id: 123,
      cid_id: 4321,
      operation: 'check in',
      timestamp: eventUpdateDateString,
      gender: 'f',
      nationality: 'gbr',
      centre: 'bigone'
    };

    var detaineeAttrs = {
      person_id: 123,
      cid_id: 1234,
      centre: 1,
      gender: 'male',
      operation: 'check in',
      timestamp: detaineeUpdateDateString
    }

    var getSearchResult = () => Detainee.find({
      centre: detaineeAttrs.centre,
      person_id: detaineeAttrs.person_id
    });

    Given('a Detainee with person id `' + detaineeAttrs.person_id + '` from centre `' + detaineeAttrs.centre + '` already exists', () =>

      global.initializeBarrelsFixtures()
        .then(() => Detainee.create(detaineeAttrs))
        .then(() => getSearchResult())
        .then((models) => {
          expect(models).to.be.length(1);
          expect(models[0].gender).to.equal(detaineeAttrs.gender);
          expect(models[0].cid_id).to.equal(detaineeAttrs.cid_id);
        })
    );

    And('the time of the existing Detainee timestamp `' + detaineeAttrs.timestamp + '` is later than the time of the operation timestamp `' + payload.timestamp + '`', () =>
      expect(detaineeAttrs.timestamp).to.be.above(payload.timestamp)
    );

    When('a valid check in operation from centre `' + payload.centre + '` with person id `' + payload.person_id + '` occurs', () =>

      request(sails.hooks.http.app)
        .post('/irc_entry/event')
        .send(payload)
        .expect(201)
    );

    Then('the existing Detainee with person id `' + detaineeAttrs.person_id + '` from centre `' + detaineeAttrs.centre + '` should not be updated from the operation received', () =>

      getSearchResult().then((models) => {
        expect(models).to.be.length(1);
        expect(models[0].gender).to.equal(detaineeAttrs.gender);
        expect(models[0].cid_id).to.equal(detaineeAttrs.cid_id);
      })
    );

  });

  var exampleEvents = {
    OPERATION_CHECK_IN: {
      operation: Event2.OPERATION_CHECK_IN,
      person_id: 123,
      timestamp: (new Date()).toISOString(),
      centre: 'bigone',
      cid_id: 4321,
      gender: 'f',
      nationality: 'gbr'
    },

    OPERATION_INTER_SITE_TRANSFER: {
      operation: Event2.OPERATION_INTER_SITE_TRANSFER,
      person_id: 123,
      timestamp: (new Date()).toISOString(),
      centre: 'bigone',
      centre_to: 'thenextcentre',
      reason: 'Other'
    },

    OPERATION_CHECK_OUT: {
      operation: Event2.OPERATION_CHECK_OUT,
      person_id: 123,
      timestamp: (new Date()).toISOString(),
      centre: 'bigone'
    },
    OPERATION_REINSTATEMENT: {
      operation: Event2.OPERATION_REINSTATEMENT,
      person_id: 123,
      timestamp: (new Date()).toISOString(),
      centre: 'bigone'
    }
  };

  Scenario('An unexpected check in appears on the wallboard, and its associated CID shows in the drilldown', () => {

    const centre = {
      name: 'bigone',
      male_capacity: 999,
      female_capacity: 750,
      id: 1,
      male_cid_name: ['bigone male holding', 'smallone male holding'],
      female_cid_name: ['bigone female office', 'smallone female holding']
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

    And('it has no events', () => expect(Event.find({})).to.eventually.be.empty);

    And('it has no movements', () => expect(Movement.find({})).to.eventually.be.empty);

    When('a check in event occurs', () =>
      createRequest(exampleEvents.OPERATION_CHECK_IN, '/irc_entry/event', 201)
        .then(() => expect(Event.find({})).to.eventually.have.lengthOf(1))
    );

    Then('the event should appear in the `Unexpected incoming` section', () =>
      request_auth(sails.hooks.http.app)
        .get('/centres')
        .expect(200)
        .then(res =>
          expect((this.centres = res.body.data)).to.be.an('array')
            .that.has.lengthOf(1)
            .with.deep.property('[0].attributes.femaleUnexpectedIn')
            .that.is.an('array').that.has.lengthOf(1)
            .with.deep.property('[0].cid_id', exampleEvents.OPERATION_CHECK_IN.cid_id))
    );

    And('the centre\'s `availability` count should be unchanged', () =>
      expect(this.centres[0].attributes.maleAvailability).to.equal(this.centres[0].attributes.maleCapacity)
    );
  });

  describe('Check in', () => {
    it('should be able to be created', () => {
      return request(sails.hooks.http.app)
        .post('/irc_entry/event')
        .send(exampleEvents.OPERATION_CHECK_IN)
        .expect(201)
    });
  });

  describe('Inter Site Transfer', () => {
    it('should give a 422 status for unknown detainee', () => {
      return request(sails.hooks.http.app)
        .post('/irc_entry/event')
        .send(exampleEvents.OPERATION_INTER_SITE_TRANSFER)
        .expect(422)
    });
  });
});

