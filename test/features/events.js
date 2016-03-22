'use strict';

Feature('Detainee Event', () => {

  Scenario('Non-Existent DetaineeEvent should be Created', () => {

    var date = new Date(923423234);
    var dateString = date.toISOString();
    var payload = {
      person_id: 123,
      cid_id: 999,
      operation: 'check in',
      timestamp: dateString,
      gender: 'm',
      nationality: 'gbr',
      centre: 'abc'
    };

    before(function () {
      global.testConfig.initializeBarrelsFixtures = false;
    });

    after(function () {
      global.testConfig.initializeBarrelsFixtures = true;
    });

    Given('a detainee event with timestamp "' + dateString + '" has not already occurred', () =>

      global.initializeBarrelsFixtures()
        .then(() =>
          DetaineeEvent.find({
            where: {
              timestamp: dateString,
              operation: 'check in'
            }
          }).then((models) =>
            expect(models.length).to.equal(0)
          )
        )

    );

    When('a valid detainee event with timestamp "' + dateString + '" occurs', () =>

      request(sails.hooks.http.app)
        .post('/irc_entry/event')
        .send(payload)
        .expect(201)

    );

    Then('an event with specific timestamp "' + dateString + '" is created from the detainee event received', () =>

      DetaineeEvent.find({
        where: {
          timestamp: dateString,
          operation: 'check in',
          cid_id: 999,
          gender: 'male',
          id: 'abc_123',
          centre: 'abc'
        }
      }).then((models) => expect(models.length).to.equal(1))

    );

  });

  Scenario('DetaineeEvent should be created', () => {

    var date = new Date();
    var dateString = date.toISOString();
    var payload = {
      person_id: 123,
      cid_id: 100,
      operation: 'check in',
      timestamp: dateString,
      gender: 'm',
      nationality: 'gbr',
      centre: 'abc'
    };

    before(function () {
      global.testConfig.initializeBarrelsFixtures = false;
    });

    after(function () {
      global.testConfig.initializeBarrelsFixtures = true;
    });

    var createEvent = function () {
      return request(sails.hooks.http.app)
        .post('/irc_entry/event')
        .send(payload)
        .expect(201);
    }

    Given('a detainee event with timestamp "' + dateString + '" has already occurred', () =>

      global.initializeBarrelsFixtures().then(() =>
        createEvent().then(() =>
            DetaineeEvent.find({
              where: {
                timestamp: dateString,
                operation: 'check in'
              }
            }).then((models) => expect(models.length).to.equal(1))
          )
        )

    );

    When('a valid detainee event with timestamp "' + dateString + '" occurs', createEvent);

    Then('a detainee event with timestamp "' + dateString + '" should be created from the check in received', () =>

      DetaineeEvent.find({
        where: {
          timestamp: dateString,
          operation: 'check in'
        }
      }).then((models) =>
        expect(models.length).to.equal(2)
      )
    );

  });

  Scenario('Existing DetaineeEvent Should Be Updated From Check In Operation That Occurred After The DetaineeEvent Creation', () => {

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
      centre: 'aftercentre'
    };

    var expectedPersonId = payload.centre + '_' + payload.person_id;

    var detaineeEventAttrs = {
      person_id: 123,
      cid_id: 1234,
      centre: 'aftercentre',
      gender: 'male',
      operation: 'check in',
      timestamp: detaineeUpdateDateString
    }

    var getSearchResult = () => DetaineeEvent.find({
      id: expectedPersonId
    });

    Given('a DetaineeEvent with the person id `' + expectedPersonId + '` already exists', () =>

      global.initializeBarrelsFixtures()
        .then(() =>
          DetaineeEvent.create(detaineeEventAttrs)
            .then(() =>
              getSearchResult()
                .then((models) => {
                  expect(models[0].gender).to.equal(detaineeEventAttrs.gender);
                  expect(models[0].cid_id).to.equal(detaineeEventAttrs.cid_id);
                })
            )
        )

    );

    And('the time of the event timestamp (' + payload.timestamp + ') is later than the existing DetaineeEvent creation timestamp (' + detaineeEventAttrs.timestamp + ')', () =>
      expect(payload.timestamp).to.be.above(detaineeEventAttrs.timestamp)
    );

    When('a valid detainee event from centre `' + payload.centre + '` with person id `' + payload.person_id + '` occurs', () =>
      request(sails.hooks.http.app)
        .post('/irc_entry/event')
        .send(payload)
        .expect(201)
    );

    Then('the existing detainee with person id `' + expectedPersonId + '` is updated from the detainee event received', () =>
      getSearchResult().then((models) => {
        expect(models[0].gender).to.equal('female');
        expect(models[0].cid_id).to.equal(payload.cid_id);
        expect(models).to.have.length(2);
      })
    );

  });

  Scenario('Existing DetaineeEvent Should Not Be Updated From Check In Operation That Occurred Before The DetaineeEvent Creation', () => {

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
      centre: 'anothercentre'
    };

    var expectedPersonId = payload.centre + '_' + payload.person_id;

    var detaineeEventAttrs = {
      person_id: 123,
      cid_id: 1234,
      centre: 'anothercentre',
      gender: 'male',
      operation: 'check in',
      timestamp: detaineeUpdateDateString
    }

    var getSearchResult = () => DetaineeEvent.find({
      id: expectedPersonId
    });

    Given('a DetaineeEvent with the person id `' + expectedPersonId + '` already exists', () =>

      global.initializeBarrelsFixtures().then(() =>
        DetaineeEvent.create(detaineeEventAttrs).then(() =>
          getSearchResult().then((models) => {
            expect(models[0].gender).to.equal(detaineeEventAttrs.gender);
            expect(models[0].cid_id).to.equal(detaineeEventAttrs.cid_id);
          })
        )
      )

    );

    And('the time of the existing DetaineeEvent timestamp (' + detaineeEventAttrs.timestamp + ') is later than the time of the operation timestamp (' + payload.timestamp + ')', () =>
      expect(detaineeEventAttrs.timestamp).to.be.above(payload.timestamp)
    );

    When('a valid check in operation from centre `' + payload.centre + '` with person id `' + payload.person_id + '` occurs', () =>

      request(sails.hooks.http.app)
        .post('/irc_entry/event')
        .send(payload)
        .expect(201)

    );

    Then('the existing DetaineeEvent with person id `' + expectedPersonId + '` should not be updated from the operation received', () =>

      getSearchResult().then((models) => {
        expect(models.length).to.equal(2);
        expect(models[0].gender).to.equal('male');
        expect(models[0].cid_id).to.equal(1234);
      })

    );

  });
});

