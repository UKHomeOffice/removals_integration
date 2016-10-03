'use strict';

const BedEvent2 = require('../../api/models/BedEvent');
const centre = {
  name: 'testexample',
  male_capacity: 999,
  female_capacity: 750,
  id: 1,
  male_cid_name: ['testexample male holding', 'smallone male holding'],
  female_cid_name: ['bigone female office', 'smallone female holding']
};
const bedRef = 'testExample';
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
        centre: centre.name,
        bed_ref: bedRef,
        reason: 'Other',
        gender: 'm'
      },
      IN_COMMISSION: {
        operation: BedEvent2.OPERATION_IN_COMMISSION,
        timestamp: timestamp.new,
        centre: centre.name,
        bed_ref: bedRef
      }
    };
    before(function () {
      global.testConfig.initializeBarrelsFixtures = false;
    });

    after(function () {
      global.testConfig.initializeBarrelsFixtures = true;
    });

    Given('there is a single centre', () =>
      Centres.create(centre)
        .then(() => expect(Centres.find({id: centre.id})).to.eventually.have.lengthOf(1))
    );

    And(`an OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`, () =>
      createRequest(payload.OUT_OF_COMMISSION, '/irc_entry/event', 201)
    );

    When(`a new IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" occurs`, () =>
      createRequest(payload.IN_COMMISSION, '/irc_entry/event', 201)
    );

    Then(`IC Bed Event with bed ref "${bedRef}" is marked as active`, () =>
      findBedEvent(payload.IN_COMMISSION, true)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    And(`OOC Bed Event with bed ref "${bedRef}" is marked as inactive`, () =>
      findBedEvent(payload.OUT_OF_COMMISSION, false)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

  });

  Scenario('New OOC then Old IC', () => {
    var payload = {
      OUT_OF_COMMISSION: {
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        timestamp: timestamp.new,
        centre: centre.name,
        bed_ref: bedRef,
        reason: 'this',
        gender: 'm'
      },
      OUT_OF_COMMISSION_SINGLE_OCCUPANCY: {
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        single_occupancy_person_id: 99999,
        timestamp: timestamp.new,
        centre: centre.name,
        bed_ref: bedRef,
        reason: 'Single Occupancy',
        gender: 'm'
      },
      IN_COMMISSION: {
        operation: BedEvent2.OPERATION_IN_COMMISSION,
        timestamp: timestamp.old,
        centre: centre.name,
        bed_ref: bedRef
      }
    };

    before(function () {
      global.testConfig.initializeBarrelsFixtures = false;
    });

    after(function () {
      global.testConfig.initializeBarrelsFixtures = true;
    });

    Scenario('Reason: Single Occupancy', () => {
      Given('there is a single centre', () =>
        Centres.destroy()
          .then(() => Centres.create(centre))
          .then(() => expect(Centres.find()).to.eventually.have.lengthOf(1))
      );

      And(`an OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" & reason "${payload.OUT_OF_COMMISSION_SINGLE_OCCUPANCY.reason}" occurs`, () =>
        createRequest(payload.OUT_OF_COMMISSION_SINGLE_OCCUPANCY, '/irc_entry/event', 201)
      );

      When(`an old IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`, () =>
        createRequest(payload.IN_COMMISSION, '/irc_entry/event', 201)
      );

      Then(`OOC Bed Event with bed ref "${bedRef}" remains marked as active`, () =>
        findBedEvent(payload.OUT_OF_COMMISSION_SINGLE_OCCUPANCY, true)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      And(`IC Bed Event with bed ref "${bedRef}" is marked as inactive`, () =>
        findBedEvent(payload.IN_COMMISSION, false)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      And("the centre's `out of commission details` object should include the occ", () =>
        assertCentresHTTPResponse('maleOutOfCommissionDetail.Single Occupancy', 1)
      );
    });

    Scenario('Reason: Maintenance - Malicious/Accidental Damage', () => {
      var OUT_OF_COMMISSION = {
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        timestamp: timestamp.new,
        centre: centre.name,
        bed_ref: bedRef,
        reason: 'Maintenance - Malicious/Accidental Damage',
        gender: 'm'
      };

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
      });

      after(function () {
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given('there is a single centre', () =>
        Centres.destroy()
          .then(() => Centres.create(centre))
          .then(() => expect(Centres.find()).to.eventually.have.lengthOf(1))
      );

      And(`an OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" & reason "${OUT_OF_COMMISSION.reason}" occurs`, () =>
        createRequest(OUT_OF_COMMISSION, '/irc_entry/event', 201)
      );

      When(`a old IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`, () =>
        createRequest(payload.IN_COMMISSION, '/irc_entry/event', 201)
      );

      Then(`OOC Bed Event with bed ref "${bedRef}" remains marked as active`, () =>
        findBedEvent(OUT_OF_COMMISSION, true)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      And(`IC Bed Event with bed ref "${bedRef}" is marked as inactive`, () =>
        findBedEvent(payload.IN_COMMISSION, false)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      And("the centre's `out of commission details` object should include the occ", () =>
        assertCentresHTTPResponse('maleOutOfCommissionDetail.Maintenance - Malicious/Accidental Damage', 1)
      );
    });

    Scenario('Reason: Maintenance - Health and Safety Concern', () => {
      var OUT_OF_COMMISSION = {
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        timestamp: timestamp.new,
        centre: centre.name,
        bed_ref: bedRef,
        reason: 'Maintenance - Health and Safety Concern',
        gender: 'm'
      };
      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
      });

      after(function () {
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given('there is a single centre', () =>
        Centres.destroy()
          .then(() => Centres.create(centre))
          .then(() => expect(Centres.find()).to.eventually.have.lengthOf(1))
      );

      And(`an OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" & reason "${OUT_OF_COMMISSION.reason}" occurs`, () =>
        createRequest(OUT_OF_COMMISSION, '/irc_entry/event', 201)
      );

      When(`a old IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`, () =>
        createRequest(payload.IN_COMMISSION, '/irc_entry/event', 201)
      );

      Then(`OOC Bed Event with bed ref "${bedRef}" remains marked as active`, () =>
        findBedEvent(OUT_OF_COMMISSION, true)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      And(`IC Bed Event with bed ref "${bedRef}" is marked as inactive`, () =>
        findBedEvent(payload.IN_COMMISSION, false)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      And("the centre's `out of commission details` object should include the occ", () =>
        assertCentresHTTPResponse('maleOutOfCommissionDetail.Maintenance - Health and Safety Concern', 1)
      );
    });

    Scenario('Reason: Maintenance - Planned works', () => {
      var OUT_OF_COMMISSION = {
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        timestamp: timestamp.new,
        centre: centre.name,
        bed_ref: bedRef,
        reason: 'Maintenance - Planned works',
        gender: 'm'
      };

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
      });

      after(function () {
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given('there is a single centre', () =>
        Centres.destroy()
          .then(() => Centres.create(centre))
          .then(() => expect(Centres.find()).to.eventually.have.lengthOf(1))
      );

      And(`an OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" & reason "${OUT_OF_COMMISSION.reason}" occurs`, () =>
        createRequest(OUT_OF_COMMISSION, '/irc_entry/event', 201)
      );

      When(`a old IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`, () =>
        createRequest(payload.IN_COMMISSION, '/irc_entry/event', 201)
      );

      Then(`OOC Bed Event with bed ref "${bedRef}" remains marked as active`, () =>
        findBedEvent(OUT_OF_COMMISSION, true)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      And(`IC Bed Event with bed ref "${bedRef}" is marked as inactive`, () =>
        findBedEvent(payload.IN_COMMISSION, false)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      And("the centre's `out of commission details` object should include the occ", () =>
        assertCentresHTTPResponse('maleOutOfCommissionDetail.Maintenance - Planned works', 1)
      );
    });
    Scenario('Reason: Crime Scene', () => {
      var OUT_OF_COMMISSION = {
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        timestamp: timestamp.new,
        centre: centre.name,
        bed_ref: bedRef,
        reason: 'Crime Scene',
        gender: 'm'
      };

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
      });

      after(function () {
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given('there is a single centre', () =>
        Centres.destroy()
          .then(() => Centres.create(centre))
          .then(() => expect(Centres.find()).to.eventually.have.lengthOf(1))
      );

      And(`an OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" & reason "${OUT_OF_COMMISSION.reason}" occurs`, () =>
        createRequest(OUT_OF_COMMISSION, '/irc_entry/event', 201)
      );

      When(`a old IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`, () =>
        createRequest(payload.IN_COMMISSION, '/irc_entry/event', 201)
      );

      Then(`OOC Bed Event with bed ref "${bedRef}" remains marked as active`, () =>
        findBedEvent(OUT_OF_COMMISSION, true)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      And(`IC Bed Event with bed ref "${bedRef}" is marked as inactive`, () =>
        findBedEvent(payload.IN_COMMISSION, false)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      And("the centre's `out of commission details` object should include the occ", () =>
        assertCentresHTTPResponse('maleOutOfCommissionDetail.Crime Scene', 1)
      );
    });

    Scenario('Reason: Medical Isolation', () => {
      var OUT_OF_COMMISSION = {
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        timestamp: timestamp.new,
        centre: centre.name,
        bed_ref: bedRef,
        reason: 'Medical Isolation',
        gender: 'm'
      };

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
      });

      after(function () {
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given('there is a single centre', () =>
        Centres.destroy()
          .then(() => Centres.create(centre))
          .then(() => expect(Centres.find()).to.eventually.have.lengthOf(1))
      );

      And(`an OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" & reason "${OUT_OF_COMMISSION.reason}" occurs`, () =>
        createRequest(OUT_OF_COMMISSION, '/irc_entry/event', 201)
      );

      When(`a old IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`, () =>
        createRequest(payload.IN_COMMISSION, '/irc_entry/event', 201)
      );

      Then(`OOC Bed Event with bed ref "${bedRef}" remains marked as active`, () =>
        findBedEvent(OUT_OF_COMMISSION, true)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      And(`IC Bed Event with bed ref "${bedRef}" is marked as inactive`, () =>
        findBedEvent(payload.IN_COMMISSION, false)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      And("the centre's `out of commission details` object should include the occ", () =>
        assertCentresHTTPResponse('maleOutOfCommissionDetail.Medical Isolation', 1)
      );
    });

    Scenario('Reason: Other', () => {
      var OUT_OF_COMMISSION = {
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        timestamp: timestamp.new,
        centre: centre.name,
        bed_ref: bedRef,
        reason: 'Other',
        gender: 'm'
      };

      before(function () {
        global.testConfig.initializeBarrelsFixtures = false;
      });

      after(function () {
        global.testConfig.initializeBarrelsFixtures = true;
      });

      Given('there is a single centre', () =>
        Centres.destroy()
          .then(() => Centres.create(centre))
          .then(() => expect(Centres.find()).to.eventually.have.lengthOf(1))
      );

      And(`an OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" & reason "${OUT_OF_COMMISSION.reason}" occurs`, () =>
        createRequest(OUT_OF_COMMISSION, '/irc_entry/event', 201)
      );

      When(`a old IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`, () =>
        createRequest(payload.IN_COMMISSION, '/irc_entry/event', 201)
      );

      Then(`OOC Bed Event with bed ref "${bedRef}" remains marked as active`, () =>
        findBedEvent(OUT_OF_COMMISSION, true)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      And(`IC Bed Event with bed ref "${bedRef}" is marked as inactive`, () =>
        findBedEvent(payload.IN_COMMISSION, false)
          .then((bedEvents) => expect(bedEvents.length).to.equal(1))
      );

      And("the centre's `out of commission details` object should include the occ", () =>
        assertCentresHTTPResponse('maleOutOfCommissionDetail.Other', 1)
      );
    });
  });

  Scenario('Old OOC then New OOC then Newest IC', () => {
    var payload = {
      OUT_OF_COMMISSION: [{
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        timestamp: timestamp.old,
        centre: centre.name,
        bed_ref: bedRef,
        reason: 'Other',
        gender: 'm'
      }, {
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        single_occupancy_person_id: 99999,
        timestamp: timestamp.new,
        centre: centre.name,
        bed_ref: bedRef,
        reason: 'Single Occupancy',
        gender: 'm'
      }],
      IN_COMMISSION: {
        operation: BedEvent2.OPERATION_IN_COMMISSION,
        timestamp: timestamp.newest,
        centre: centre.name,
        bed_ref: bedRef
      }
    };

    before(function () {
      global.testConfig.initializeBarrelsFixtures = false;
    });

    after(function () {
      global.testConfig.initializeBarrelsFixtures = true;
    });

    Given('there is a single centre', () =>
      Centres.destroy()
        .then(() => Centres.create(centre))
        .then(() => expect(Centres.find()).to.eventually.have.lengthOf(1))
    );

    And(`an OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`, () =>
      createRequest(payload.OUT_OF_COMMISSION[0], '/irc_entry/event', 201)
    );

    When(`a new OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" occurs`, () =>
      createRequest(payload.OUT_OF_COMMISSION[1], '/irc_entry/event', 201)
    );

    And(`a new IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.newest}" occurs`, () =>
      createRequest(payload.IN_COMMISSION, '/irc_entry/event', 201)
    );

    Then(`IC Bed Event with bed ref "${bedRef}" is marked as active`, () =>
      findBedEvent(payload.IN_COMMISSION, true)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    And(`1st OOC Bed Event with bed ref "${bedRef}" is marked as inactive`, () =>
      findBedEvent(payload.OUT_OF_COMMISSION[0], false)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    And(`2nd OOC Bed Event with bed ref "${bedRef}" is marked as inactive`, () =>
      findBedEvent(payload.OUT_OF_COMMISSION[1], false)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

  });

  Scenario('Old IC then New IC then Newest OOC', () => {
    var payload = {
      IN_COMMISSION: [{
        operation: BedEvent2.OPERATION_IN_COMMISSION,
        timestamp: timestamp.old,
        centre: centre.name,
        bed_ref: bedRef
      }, {
        operation: BedEvent2.OPERATION_IN_COMMISSION,
        timestamp: timestamp.new,
        centre: centre.name,
        bed_ref: bedRef
      }],
      OUT_OF_COMMISSION: {
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        timestamp: timestamp.newest,
        centre: centre.name,
        bed_ref: bedRef,
        reason: 'Other',
        gender: 'm'
      }
    };

    before(function () {
      global.testConfig.initializeBarrelsFixtures = false;
    });

    after(function () {
      global.testConfig.initializeBarrelsFixtures = true;
    });

    Given('there is a single centre', () =>
      Centres.destroy()
        .then(() => Centres.create(centre))
        .then(() => expect(Centres.find()).to.eventually.have.lengthOf(1))
    );

    And(`a IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`, () =>
      createRequest(payload.IN_COMMISSION[0], '/irc_entry/event', 201)
    );

    When(`a new IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" occurs`, () =>
      createRequest(payload.IN_COMMISSION[1], '/irc_entry/event', 201)
    );

    And(`a new OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.newest}" occurs`, () =>
      createRequest(payload.OUT_OF_COMMISSION, '/irc_entry/event', 201)
    );

    Then(`1st IC Bed Event with bed ref "${bedRef}" is marked as inactive`, () =>
      findBedEvent(payload.IN_COMMISSION[0], false)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    And(`2nd IC Bed Event with bed ref "${bedRef}" is marked as inactive`, () =>
      findBedEvent(payload.IN_COMMISSION[1], false)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    And(`IC Bed Event with bed ref "${bedRef}" is marked as active`, () =>
      findBedEvent(payload.OUT_OF_COMMISSION, true)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );
  });

  Scenario('New OOC then Old OOC then Oldest IC', () => {
    var payload = {
      OUT_OF_COMMISSION: [{
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        timestamp: timestamp.new,
        centre: centre.name,
        bed_ref: bedRef,
        reason: 'Other',
        gender: 'm'
      }, {
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        timestamp: timestamp.old,
        centre: centre.name,
        bed_ref: bedRef,
        reason: 'Other',
        gender: 'm'
      }],
      IN_COMMISSION: {
        operation: BedEvent2.OPERATION_IN_COMMISSION,
        timestamp: timestamp.oldest,
        centre: centre.name,
        bed_ref: bedRef
      }
    };

    before(function () {
      global.testConfig.initializeBarrelsFixtures = false;
    });

    after(function () {
      global.testConfig.initializeBarrelsFixtures = true;
    });

    Given('there is a single centre', () =>
      Centres.destroy()
        .then(() => Centres.create(centre))
        .then(() => expect(Centres.find()).to.eventually.have.lengthOf(1))
    );

    And(`a OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" occurs`, () =>
      createRequest(payload.OUT_OF_COMMISSION[0], '/irc_entry/event', 201)
    );

    When(`a old OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`, () =>
      createRequest(payload.OUT_OF_COMMISSION[1], '/irc_entry/event', 201)
    );

    And(`a older IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.oldest}" occurs`, () =>
      createRequest(payload.IN_COMMISSION, '/irc_entry/event', 201)
    );

    Then(`1st OOC Bed Event with bed ref "${bedRef}" remains marked as active`, () =>
      findBedEvent(payload.OUT_OF_COMMISSION[0], true)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    And(`2nd OOC Bed Event with bed ref "${bedRef}" is marked as inactive`, () =>
      findBedEvent(payload.OUT_OF_COMMISSION[1], false)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    And(`IC Bed Event with bed ref "${bedRef}" is marked as inactive`, () =>
      findBedEvent(payload.IN_COMMISSION, false)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    And("the centre's `out of commission details` object should include the occ", () =>
      assertCentresHTTPResponse('maleOutOfCommissionDetail.Other', 1)
    );
  });

  Scenario('New IC then Old IC then Oldest OOC', () => {
    var payload = {
      OUT_OF_COMMISSION: {
        operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
        timestamp: timestamp.oldest,
        centre: centre.name,
        bed_ref: bedRef,
        reason: 'Other',
        gender: 'm'
      },
      IN_COMMISSION: [{
        operation: BedEvent2.OPERATION_IN_COMMISSION,
        timestamp: timestamp.new,
        centre: centre.name,
        bed_ref: bedRef
      }, {
        operation: BedEvent2.OPERATION_IN_COMMISSION,
        timestamp: timestamp.old,
        centre: centre.name,
        bed_ref: bedRef
      }]
    };

    before(function () {
      global.testConfig.initializeBarrelsFixtures = false;
    });

    after(function () {
      global.testConfig.initializeBarrelsFixtures = true;
    });

    Given('there is a single centre', () =>
      Centres.destroy()
        .then(() => Centres.create(centre))
        .then(() => expect(Centres.find()).to.eventually.have.lengthOf(1))
    );

    And(`a IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.new}" occurs`, () =>
      createRequest(payload.IN_COMMISSION[0], '/irc_entry/event', 201)
    );

    When(`a old IC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.old}" occurs`, () =>
      createRequest(payload.IN_COMMISSION[1], '/irc_entry/event', 201)
    );

    And(`a older OOC Bed Event with bed ref "${bedRef}" & timestamp "${timestamp.oldest}" occurs`, () =>
      createRequest(payload.OUT_OF_COMMISSION, '/irc_entry/event', 201)
    );

    Then(`1st IC Bed Event with bed ref "${bedRef}" remains marked as active`, () =>
      findBedEvent(payload.IN_COMMISSION[0], true)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    And(`2nd IC Bed Event with bed ref "${bedRef}" is marked as inactive`, () =>
      findBedEvent(payload.IN_COMMISSION[1], false)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

    And(`OOC Bed Event with bed ref "${bedRef}" is marked as inactive`, () =>
      findBedEvent(payload.OUT_OF_COMMISSION, false)
        .then((bedEvents) => expect(bedEvents.length).to.equal(1))
    );

  });

  Scenario('Reject duplications with 208', () => {

    before(function () {
      global.testConfig.initializeBarrelsFixtures = false;
      return global.initializeBarrelsFixtures();
    });

    after(function () {
      global.testConfig.initializeBarrelsFixtures = true;
    });

    const payload = {
      operation: BedEvent2.OPERATION_OUT_OF_COMMISSION,
      timestamp: new Date(923423234).toISOString(),
      centre: "bigone",
      bed_ref: "m123",
      reason: 'Other',
      gender: 'm'
    };
    Given('I send an out of commission', () =>
      request(sails.hooks.http.app)
        .post('/irc_entry/event')
        .send(payload)
        .expect(201)
    )
    Then('I send another out of commission', () =>
      request(sails.hooks.http.app)
        .post('/irc_entry/event')
        .send(payload)
        .expect(208)
    )
  });
});
