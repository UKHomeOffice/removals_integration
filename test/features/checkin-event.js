'use strict';

Feature('Check In Event', () => {

  Scenario('Non-Existent Event should be Created', () => {

    var promise;
    var date = new Date();
    var isoDate = date.toISOString();
    var payload = {
      person_id: 123,
      cid_id: 100,
      operation: 'check in',
      timestamp: isoDate,
      gender: 'm',
      nationality: 'gbr',
      centre: 'abc'
    };
    var detainee = {
      id: 'abc_123'
    };

    before(function () {
      global.overrideSharedBeforeEach = true;
    });

    after(function () {
      return Events.destroy();
    });

    Given('a check in event from centre `abc` relating to person id 123 has not already occurred', function () {

      return Events.find().then((models) => {
        return expect(models.length).to.equal(0);
      })

    });

    When('a valid check in event from centre `abc` with person id 123 occurs', function () {

      return request(sails.hooks.http.app)
        .post('/irc_entry/event')
        .send(payload)
        .expect(201);

    });

    Then('an event relating to detainee with person id `abc_123` is created from the check in event received', function () {

      return Events.find().then((models) => {
        models.should.have.length(1);
        models.should.include.an.item.with.property('detainee', 'abc_123');
        models.should.include.an.item.with.property('operation', 'check in');
      });

    });

  });

  Scenario('Event should be created', () => {

    var chain;
    var date = new Date();
    var isoDate = date.toISOString();
    var payload = {
      person_id: 123,
      cid_id: 100,
      operation: 'check in',
      timestamp: isoDate,
      gender: 'm',
      nationality: 'gbr',
      centre: 'abc'
    };
    var detainee = {
      id: 'abc_123'
    };

    before(function () {
      global.overrideSharedBeforeEach = true;
    });

    after(function () {
      return Events.destroy();
    });

    Given('a check in event from centre `abc` relating to person id 123 has already occurred', () => {
      // trigger a check in event from centre `abc` relating to a detainee with person_id `xx`
      Events.find().then((models) => {
        expect(models.length).to.equal(0);
      });

      return request(sails.hooks.http.app)
        .post('/irc_entry/event')
        .send(payload)
        .expect(201)
        .then(() => {
          return Events.find();
        });

    });

    When('a valid check in event with person id 123 occurs', () => {
      // trigger a check in event with a payload
      return request(sails.hooks.http.app)
        .post('/irc_entry/event')
        .send(payload)
        .expect(201)
        .then(() => {
          return Events.find();
        });
    });

    Then('an event relating to person id `abc_123` should be created from the check in received', () => {
      // check that an event relating to detainee `abc_xx` has been created
      return Events.find().then((models) => {
        expect(models.length).to.equal(2);
        expect(models).to.include.an.item.with.property('detainee', 'abc_123');
        expect(models).to.include.an.item.with.property('operation', 'check in');
      });

    });

  });

  Scenario('Non-Existent Detainee Should be Created', () => {

    var date = new Date();
    var isoDate = date.toISOString();
    var payload = {
      person_id: 123,
      cid_id: 100,
      operation: 'check in',
      timestamp: isoDate,
      gender: 'm',
      nationality: 'gbr',
      centre: 'abc'
    };
    var detainee = {
      id: 'abc_123'
    };

    before(function (done) {
      global.overrideSharedBeforeEach = true;
      return Detainees.destroy();
    });

    after(function () {
      Events.destroy();
      return Detainees.destroy();
    });

    Given('a detainee with the person id `abc_xx` does not already exist', () => {
      // check that no detainee model with person_id `xx` exists
      return Detainees.find({id: 'abc_123'}).then(models => {
        models.should.have.length(0);
      });
    });

    When('a valid check in event from centre `abc` with person id `xx` occurs', () => {
      // trigger a check in event with a payload
      return request(sails.hooks.http.app)
        .post('/irc_entry/event')
        .send(payload)
        .expect(201);
    });

    Then('a detainee with person id `abc_xx` is created from the check in event received', () => {
      // check that a detainee exists and that the detainee properties are as expected
      return Detainees.find({id: 'abc_123'}).then((models) => {
        models.should.have.length(1);
        models.should.include.an.item.with.property('id', 'abc_123');
        models.should.include.an.item.with.property('cid_id', 100);
      });

    });

  });

  Scenario('Existing Detainee Should Be Updated', () => {

    Given('a detainee with the person id `abc_xx` already exists', () => {
      // Create a detainee model with person_id `abc_xx`
    });
    And('the time of the event timestamp is later than the existing detainee update timestamp', () => {
      // Update the detainee model person_id `abc_xx` to ensure the timestamp is < event timestamp
    });
    When('a valid check in event from centre `abc` with person id `xx` occurs', () => {
      // trigger a check in event with a payload
    });
    Then('the existing detainee with person id `abc_xx` is updated from the check in event received', () => {
      // check that the existing detainee properties now match the check in event detainee properties
    });

  });

  Scenario('Existing Detainee Should Not Be Updated', () => {

    Given('a detainee with the person id `abc_xx` already exists', () => {
      // Create a detainee model with person_id `abc_xx`
    });
    And('the time of the existing detainee update timestamp is later than the event timestamp', () => {
      // Update the detainee model person_id `abc_xx` to ensure the timestamp is > event timestamp
    });
    When('a valid check in event with from centre `abc` and person id `xx` occurs', () => {
      // trigger a check in event with a payload
    });
    Then('the existing detainee with person id `abc_xx` should not be updated from the event received', () => {
      // check that the existing detainee properties remain the same
    });

  });
});

