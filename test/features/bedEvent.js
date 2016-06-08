'use strict';

var BedEvent2 = require('../../api/models/BedEvent');
var bedRef = '123';
var centreName = 'bigone';
var timestamp = {
  newest: "2017-11-23T18:25:43.511Z",
  new: "2016-11-23T18:25:42.511Z",
  old: "2015-11-23T18:25:41.511Z",
  oldest: "2014-11-23T18:25:40.511Z"
};

var findBedEvent = (event, active) =>
  BedEvent
    .find({
      where: {
        timestamp: event.timestamp,
        operation: event.operation,
        active: active
      }
    })
    .populate('bed', {where: {bed_ref: event.bed_ref}})
    .toPromise()
    .filter((bedEvents) => !_.isEmpty(bedEvents.bed));

Feature('Bed Events', () => {
  Scenario('Old OOC then New IC', () => {
    var payload = {
      OUT_OF_COMMISSION: {
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        timestamp: timestamp.old,
        centre: centreName,
        bed_ref: bedRef,
        reason: 'Other',
        gender: 'm'
      },
      IN_COMMISSION: {
        operation: BedEvent2.OPERATION_IN_COMMISSION,
        timestamp: timestamp.new,
        centre: centreName,
        bed_ref: bedRef
      }
    };
    before(function () {
      global.testConfig.initializeBarrelsFixtures = false;
      return global.initializeBarrelsFixtures();
    });

    after(function () {
      global.testConfig.initializeBarrelsFixtures = true;
    });

    Given(`an OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`,
      () => createRequest(payload.OUT_OF_COMMISSION, '/irc_entry/event', 201)
        .then(() => findBedEvent(payload.OUT_OF_COMMISSION, true))
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    When(`a new IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" occurs`,
      () => createRequest(payload.IN_COMMISSION, '/irc_entry/event', 201)
    );

    Then(`IC Bed Event with bed ref "${bedRef}" is marked as active`,
      () => findBedEvent(payload.IN_COMMISSION, true)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    And(`OOC Bed Event with bed ref "${bedRef}" is marked as inactive`,
      () => findBedEvent(payload.OUT_OF_COMMISSION, false)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );
  });

  Scenario('New OOC then Old IC', () => {
    var payload = {
      OUT_OF_COMMISSION: {
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        timestamp: timestamp.new,
        centre: centreName,
        bed_ref: bedRef,
        reason: 'Other',
        gender: 'm'
      },
      OUT_OF_COMMISSION_SINGLE_OCCUPANCY: {
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        single_occupancy_person_id: 99999,
        timestamp: timestamp.new,
        centre: centreName,
        bed_ref: bedRef,
        reason: 'Single Occupancy',
        gender: 'm'
      },
      IN_COMMISSION: {
        operation: BedEvent2.OPERATION_IN_COMMISSION,
        timestamp: timestamp.old,
        centre: centreName,
        bed_ref: bedRef
      }
    };

    before(function () {
      global.testConfig.initializeBarrelsFixtures = false;
      return global.initializeBarrelsFixtures();
    });

    after(function () {
      global.testConfig.initializeBarrelsFixtures = true;
    });

    Scenario('Reason: Single Occupancy', () => {
      Given(`an OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" & reason "${payload.OUT_OF_COMMISSION_SINGLE_OCCUPANCY.reason}" occurs`,
        () => createRequest(payload.OUT_OF_COMMISSION_SINGLE_OCCUPANCY, '/irc_entry/event', 201)
          .then(() => findBedEvent(payload.OUT_OF_COMMISSION_SINGLE_OCCUPANCY, true))
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      When(`an old IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`,
        () => createRequest(payload.IN_COMMISSION, '/irc_entry/event', 201)
      );

      Then(`OOC Bed Event with bed ref "${bedRef}" remains marked as active`,
        () => findBedEvent(payload.OUT_OF_COMMISSION_SINGLE_OCCUPANCY, true)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      And(`IC Bed Event with bed ref "${bedRef}" is marked as inactive`,
        () => findBedEvent(payload.IN_COMMISSION, false)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );
    });

    Scenario('Reason: Maintenance - Malicious/Accidental Damage', () => {
      payload.OUT_OF_COMMISSION.reason = 'Reason: Maintenance - Malicious/Accidental Damage';

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
        return global.initializeBarrelsFixtures();
      });

      after(function () {
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given(`an OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" & reason "${payload.OUT_OF_COMMISSION.reason}" occurs`,
        () => createRequest(payload.OUT_OF_COMMISSION, '/irc_entry/event', 201)
          .then(() => findBedEvent(payload.OUT_OF_COMMISSION, true))
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      When(`a old IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`,
        () => createRequest(payload.IN_COMMISSION, '/irc_entry/event', 201)
      );

      Then(`OOC Bed Event with bed ref "${bedRef}" remains marked as active`,
        () => findBedEvent(payload.OUT_OF_COMMISSION, true)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      And(`IC Bed Event with bed ref "${bedRef}" is marked as inactive`,
        () => findBedEvent(payload.IN_COMMISSION, false)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );
    });

    Scenario('Reason: Maintenance - Health and Safety Concern', () => {
      payload.OUT_OF_COMMISSION.reason = 'Reason: Maintenance - Health and Safety Concern';

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
        return global.initializeBarrelsFixtures();
      });

      after(function () {
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given(`an OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" & reason "${payload.OUT_OF_COMMISSION.reason}" occurs`,
        () => createRequest(payload.OUT_OF_COMMISSION, '/irc_entry/event', 201)
          .then(() => findBedEvent(payload.OUT_OF_COMMISSION, true))
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      When(`a old IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`,
        () => createRequest(payload.IN_COMMISSION, '/irc_entry/event', 201)
      );

      Then(`OOC Bed Event with bed ref "${bedRef}" remains marked as active`,
        () => findBedEvent(payload.OUT_OF_COMMISSION, true)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      And(`IC Bed Event with bed ref "${bedRef}" is marked as inactive`,
        () => findBedEvent(payload.IN_COMMISSION, false)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );
    });

    Scenario('Reason: Maintenance – Planned works', () => {
      payload.OUT_OF_COMMISSION.reason = 'Reason: Maintenance – Planned works';

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
        return global.initializeBarrelsFixtures();
      });

      after(function () {
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given(`an OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" & reason "${payload.OUT_OF_COMMISSION.reason}" occurs`,
        () => createRequest(payload.OUT_OF_COMMISSION, '/irc_entry/event', 201)
          .then(() => findBedEvent(payload.OUT_OF_COMMISSION, true))
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      When(`a old IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`,
        () => createRequest(payload.IN_COMMISSION, '/irc_entry/event', 201)
      );

      Then(`OOC Bed Event with bed ref "${bedRef}" remains marked as active`,
        () => findBedEvent(payload.OUT_OF_COMMISSION, true)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      And(`IC Bed Event with bed ref "${bedRef}" is marked as inactive`,
        () => findBedEvent(payload.IN_COMMISSION, false)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );
    });
    Scenario('Reason: Crime Scene', () => {
      payload.OUT_OF_COMMISSION.reason = 'Reason: Crime Scene';

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
        return global.initializeBarrelsFixtures();
      });

      after(function () {
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given(`an OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" & reason "${payload.OUT_OF_COMMISSION.reason}" occurs`,
        () => createRequest(payload.OUT_OF_COMMISSION, '/irc_entry/event', 201)
          .then(() => findBedEvent(payload.OUT_OF_COMMISSION, true))
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      When(`a old IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`,
        () => createRequest(payload.IN_COMMISSION, '/irc_entry/event', 201)
      );

      Then(`OOC Bed Event with bed ref "${bedRef}" remains marked as active`,
        () => findBedEvent(payload.OUT_OF_COMMISSION, true)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      And(`IC Bed Event with bed ref "${bedRef}" is marked as inactive`,
        () => findBedEvent(payload.IN_COMMISSION, false)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );
    });

    Scenario('Reason: Medical Isolation', () => {
      payload.OUT_OF_COMMISSION.reason = 'Reason: Medical Isolation';

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
        return global.initializeBarrelsFixtures();
      });

      after(function () {
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given(`an OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" & reason "${payload.OUT_OF_COMMISSION.reason}" occurs`,
        () => createRequest(payload.OUT_OF_COMMISSION, '/irc_entry/event', 201)
          .then(() => findBedEvent(payload.OUT_OF_COMMISSION, true))
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      When(`a old IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`,
        () => createRequest(payload.IN_COMMISSION, '/irc_entry/event', 201)
      );

      Then(`OOC Bed Event with bed ref "${bedRef}" remains marked as active`,
        () => findBedEvent(payload.OUT_OF_COMMISSION, true)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      And(`IC Bed Event with bed ref "${bedRef}" is marked as inactive`,
        () => findBedEvent(payload.IN_COMMISSION, false)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );
    });

    Scenario('Reason: Other', () => {
      payload.OUT_OF_COMMISSION.reason = 'Other';

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
        return global.initializeBarrelsFixtures();
      });

      after(function () {
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given(`an OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" & reason "${payload.OUT_OF_COMMISSION.reason}" occurs`,
        () => createRequest(payload.OUT_OF_COMMISSION, '/irc_entry/event', 201)
          .then(() => findBedEvent(payload.OUT_OF_COMMISSION, true))
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      When(`a old IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`,
        () => createRequest(payload.IN_COMMISSION, '/irc_entry/event', 201)
      );

      Then(`OOC Bed Event with bed ref "${bedRef}" remains marked as active`,
        () => findBedEvent(payload.OUT_OF_COMMISSION, true)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      And(`IC Bed Event with bed ref "${bedRef}" is marked as inactive`,
        () => findBedEvent(payload.IN_COMMISSION, false)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );
    });
  });

  Scenario('Old OOC then New OOC then Newest IC', () => {
    var payload = {
      OUT_OF_COMMISSION: [{
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        timestamp: timestamp.old,
        centre: centreName,
        bed_ref: bedRef,
        reason: 'Other',
        gender: 'm'
      }, {
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        single_occupancy_person_id: 99999,
        timestamp: timestamp.new,
        centre: centreName,
        bed_ref: bedRef,
        reason: 'Single Occupancy',
        gender: 'm'
      }],
      IN_COMMISSION: {
        operation: BedEvent2.OPERATION_IN_COMMISSION,
        timestamp: timestamp.newest,
        centre: centreName,
        bed_ref: bedRef
      }
    };

    before(function () {
      global.testConfig.initializeBarrelsFixtures = false;
      return global.initializeBarrelsFixtures();
    });

    after(function () {
      global.testConfig.initializeBarrelsFixtures = true;
    });

    Given(`an OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`,
      () => createRequest(payload.OUT_OF_COMMISSION[0], '/irc_entry/event', 201)
        .then(() => findBedEvent(payload.OUT_OF_COMMISSION[0], true))
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    When(`a new OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" occurs`,
      () => createRequest(payload.OUT_OF_COMMISSION[1], '/irc_entry/event', 201)
    );

    And(`a new IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.newest}" occurs`,
      () => createRequest(payload.IN_COMMISSION, '/irc_entry/event', 201)
    );

    Then(`IC Bed Event with bed ref "${bedRef}" is marked as active`,
      () => findBedEvent(payload.IN_COMMISSION, true)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    And(`1st OOC Bed Event with bed ref "${bedRef}" is marked as inactive`,
      () => findBedEvent(payload.OUT_OF_COMMISSION[0], false)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    And(`2nd OOC Bed Event with bed ref "${bedRef}" is marked as inactive`,
      () => findBedEvent(payload.OUT_OF_COMMISSION[1], false)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );
  });

  Scenario('Old IC then New IC then Newest OOC', () => {
    var payload = {
      OUT_OF_COMMISSION: {
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        timestamp: timestamp.newest,
        centre: centreName,
        bed_ref: bedRef,
        reason: 'Other',
        gender: 'm'
      },
      IN_COMMISSION: [{
        operation: BedEvent2.OPERATION_IN_COMMISSION,
        timestamp: timestamp.old,
        centre: centreName,
        bed_ref: bedRef
      }, {
        operation: BedEvent2.OPERATION_IN_COMMISSION,
        timestamp: timestamp.new,
        centre: centreName,
        bed_ref: bedRef
      }]
    };

    before(function () {
      global.testConfig.initializeBarrelsFixtures = false;
      return global.initializeBarrelsFixtures();
    });

    after(function () {
      global.testConfig.initializeBarrelsFixtures = true;
    });

    Given(`a IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`,
      () => createRequest(payload.IN_COMMISSION[0], '/irc_entry/event', 201)
        .then(() => findBedEvent(payload.IN_COMMISSION[0], true))
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    When(`a new IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" occurs`,
      () => createRequest(payload.IN_COMMISSION[1], '/irc_entry/event', 201)
    );
    And(`a new OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.newest}" occurs`,
      () => createRequest(payload.OUT_OF_COMMISSION, '/irc_entry/event', 201)
    );

    Then(`1st IC Bed Event with bed ref "${bedRef}" is marked as inactive`,
      () => findBedEvent(payload.IN_COMMISSION[0], false)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    And(`2nd IC Bed Event with bed ref "${bedRef}" is marked as inactive`,
      () => findBedEvent(payload.IN_COMMISSION[1], false)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    And(`IC Bed Event with bed ref "${bedRef}" is marked as active`,
      () => findBedEvent(payload.OUT_OF_COMMISSION, true)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );
  });

  Scenario('New OOC then Old OOC then Oldest IC', () => {
    var payload = {
      OUT_OF_COMMISSION: [{
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        timestamp: timestamp.new,
        centre: centreName,
        bed_ref: bedRef,
        reason: 'Other',
        gender: 'm'
      }, {
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        timestamp: timestamp.old,
        centre: centreName,
        bed_ref: bedRef,
        reason: 'Other',
        gender: 'm'
      }],
      IN_COMMISSION: {
        operation: BedEvent2.OPERATION_IN_COMMISSION,
        timestamp: timestamp.oldest,
        centre: centreName,
        bed_ref: bedRef
      }
    };

    before(function () {
      global.testConfig.initializeBarrelsFixtures = false;
      return global.initializeBarrelsFixtures();
    });

    after(function () {
      global.testConfig.initializeBarrelsFixtures = true;
    });

    Given(`a OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" occurs`,
      () => createRequest(payload.OUT_OF_COMMISSION[0], '/irc_entry/event', 201)
        .then(() => findBedEvent(payload.OUT_OF_COMMISSION[0], true))
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    When(`a old OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`,
      () => createRequest(payload.OUT_OF_COMMISSION[1], '/irc_entry/event', 201)
    );

    And(`a older IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.oldest}" occurs`,
      () => createRequest(payload.IN_COMMISSION, '/irc_entry/event', 201)
    );

    Then(`1st OOC Bed Event with bed ref "${bedRef}" remains marked as active`,
      () => findBedEvent(payload.OUT_OF_COMMISSION[0], true)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    And(`2nd OOC Bed Event with bed ref "${bedRef}" is marked as inactive`,
      () => findBedEvent(payload.OUT_OF_COMMISSION[1], false)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    And(`IC Bed Event with bed ref "${bedRef}" is marked as inactive`,
      () => findBedEvent(payload.IN_COMMISSION, false)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );
  });

  Scenario('New IC then Old IC then Oldest OOC', () => {
    var payload = {
      OUT_OF_COMMISSION: {
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        timestamp: timestamp.oldest,
        centre: centreName,
        bed_ref: bedRef,
        reason: 'Other',
        gender: 'm'
      },
      IN_COMMISSION: [{
        operation: BedEvent2.OPERATION_IN_COMMISSION,
        timestamp: timestamp.new,
        centre: centreName,
        bed_ref: bedRef
      }, {
        operation: BedEvent2.OPERATION_IN_COMMISSION,
        timestamp: timestamp.old,
        centre: centreName,
        bed_ref: bedRef
      }]
    };

    before(function () {
      global.testConfig.initializeBarrelsFixtures = false;
      return global.initializeBarrelsFixtures();
    });

    after(function () {
      global.testConfig.initializeBarrelsFixtures = true;
    });

    Given(`a IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" occurs`,
      () => createRequest(payload.IN_COMMISSION[0], '/irc_entry/event', 201)
        .then(() => findBedEvent(payload.IN_COMMISSION[0], true))
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    When(`a old IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`,
      () => createRequest(payload.IN_COMMISSION[1], '/irc_entry/event', 201)
    );

    And(`a older OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.oldest}" occurs`,
      () => createRequest(payload.OUT_OF_COMMISSION, '/irc_entry/event', 201)
    );

    Then(`1st IC Bed Event with bed ref "${bedRef}" remains marked as active`,
      () => findBedEvent(payload.IN_COMMISSION[0], true)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    And(`2nd IC Bed Event with bed ref "${bedRef}" is marked as inactive`,
      () => findBedEvent(payload.IN_COMMISSION[1], false)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    And(`OOC Bed Event with bed ref "${bedRef}" is marked as inactive`,
      () => findBedEvent(payload.OUT_OF_COMMISSION, false)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );
  });
});
