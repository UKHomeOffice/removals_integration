//'use strict';
//
//Feature('Pre-bookings: ', () => {
//
//  var today = (function (d) {
//    return d.toISOString()
//  })(new Date);
//
//var today5am = (function (d) {
//  d.setDate(d.getDate() - 1);
//  d.setMinutes(59);
//  return d.toISOString()
//})(new Date);
//
//var tomorrow7am = (function (d) {
//  d.setDate(d.getDate() + 1);
//  d.setMinutes(30);
//  return d.toISOString()
//})(new Date);
//
//  var centreEventAttrs = {
//    "name": 'bigone',
//    "male_capacity": 999,
//    "female_capacity": 750,
//    "id": 1,
//    "mo_type": 'occupancy',
//    "male_cid_name": ['bigone male holding', 'smallone male holding'],
//    "female_cid_name": ['bigone female office', 'smallone female holding']
//  };
//
//  var movementEventAttrs = {
//    "centre": 1,
//    "detainee": 2,
//    "id": 3,
//    "active": true
//  };
//
//  var movementPayload = [{
//    Location: 'bigone male holding',
//    'MO In/MO Out': 'In',
//    'MO Ref.': '215641',
//    'MO Date': today,
//    'MO Type': 'Occupancy',
//    'CID Person ID': '123'
//  }];
//
//  var prebookingEventAttrs = {
//    "id": 1,
//    "task_force": "ops1",
//    "cid_id": "123",
//    "gender": "male",
//    "centre": "bigone"
//  };
//
//  var prebookingPayload = [{
//    "timestamp": today,
//    "location": 'bigone male holding',
//    "task_force": 'ops1',
//    "cid_id": '123'
//  }];
//
//  Scenario.skip('Remove Existing Pre-bookings', () => {
//
//    before(function () {
//      global.testConfig.initializeBarrelsFixtures = false;
//    });
//
//    after(function () {
//      global.testConfig.initializeBarrelsFixtures = true;
//    });
//
//    Given('centre `' + centreEventAttrs.name + '` Pre-booking count exist', () => {
//
//      global.initializeBarrelsFixtures()
//        .then(() =>
//          CentreEvent.create(centreEventAttrs)
//            .then(() =>
//              getSearchResult()
//                .then((models) => {
//                  expect(models[0].name).to.equal(centreEventAttrs.name);
//                })
//            )
//        )
//        .then(() =>
//          PrebookingEvent.create(prebookingEventAttrs)
//            .then(() =>
//              getSearchResult()
//                .then((models) => {
//                  expect(models[0].centre).to.equal(centreEventAttrs.name);
//                })
//            )
//        )
//
//    });
//
//    When('a Pre-booking event occurs', () => {
//
//      var newPrebookingPayload = [{
//        "timestamp": today,
//        "location": 'bigone female holding',
//        "task_force": 'ops1'
//      }]
//
//      request(sails.hooks.http.app)
//        .post('/depmu_entry/prebooking')
//        .send(newPrebookingPayload)
//        .expect(201)
//
//    });
//
//    Then('centre `' + centreEventAttrs.name + '` existing Pre-booking counts are overridden', () => {
//
//      getSearchResult().then((models) => {
//        expect(models[0].gender).to.equal('female');
//      })
//
//    });
//  });
//
//  Scenario.skip('Ignore Future Pre-bookings: Pre 6:59am Tomorrow', () => {
//
//    before(function () {
//      global.testConfig.initializeBarrelsFixtures = false;
//    });
//
//    after(function () {
//      global.testConfig.initializeBarrelsFixtures = true;
//    });
//
//    Given('centre `' + centreEventAttrs.name + '` Pre-booking count exist', () => {
//
//      global.initializeBarrelsFixtures()
//        .then(() =>
//          CentreEvent.create(centreEventAttrs)
//            .then(() =>
//              getSearchResult()
//                .then((models) => {
//                  expect(models[0].name).to.equal(centreEventAttrs.name);
//                })
//            )
//        )
//        .then(() =>
//          PrebookingEvent.create(prebookingEventAttrs)
//            .then(() =>
//              getSearchResult()
//                .then((models) => {
//                  expect(models[0].centre).to.equal(prebookingEventAttrs.name);
//                })
//            )
//        )
//
//    });
//
//    When('a Pre-booking event for centre `' + centreEventAttrs.name + '` with timestamp `' + tomorrow + '` occurs', () => {
//      var futurePrebookingPayload = [{
//        "timestamp": tomorrow,
//        "location": 'bigone female holding',
//        "task_force": 'ops1',
//        "cid_id": '444'
//      }];
//
//      request(sails.hooks.http.app)
//        .post('/depmu_entry/prebooking')
//        .send(futurePrebookingPayload)
//        .expect(201)
//
//    });
//
//    Then('centre `' + centreEventAttrs.name + '` Pre-booking counts remain the same', () => {
//
//      getSearchResult().then((models) => {
//        expect(models.length).to.equal(1);
//        expect(models[0].cid_id).to.equal(prebookingEventAttrs.cid_id);
//      })
//
//    });
//
//  });
//
//  Scenario.skip('Ignore Past Pre-bookings: Pre 7am Today', () => {
//    before(function () {
//      global.testConfig.initializeBarrelsFixtures = false;
//    });
//
//    after(function () {
//      global.testConfig.initializeBarrelsFixtures = true;
//    });
//
//    Given('centre `' + centreEventAttrs.name + '` Pre-booking counts exist', () => {
//
//      global.initializeBarrelsFixtures()
//        .then(() =>
//          CentreEvent.create(centreEventAttrs)
//            .then(() =>
//              getSearchResult()
//                .then((models) => {
//                  expect(models[0].name).to.equal(centreEventAttrs.name);
//                })
//            )
//        )
//        .then(() =>
//          PrebookingEvent.create(prebookingEventAttrs)
//            .then(() =>
//              getSearchResult()
//                .then((models) => {
//                  expect(models[0].centre).to.equal(prebookingEventAttrs.name);
//                })
//            )
//        )
//
//    });
//
//    When('a Pre-booking event for centre `' + centreEventAttrs.name + '` with timestamp `' + yesterday + '` occurs', () => {
//      prebookingPayload.timestamp = yesterday;
//
//      request(sails.hooks.http.app)
//        .post('/depmu_entry/prebooking')
//        .send(prebookingPayload)
//        .expect(201)
//
//    });
//
//    Then('centre `' + centreEventAttrs.name + '` Pre-booking counts remain the same', () => {
//
//      getSearchResult().then((models) => {
//        expect(models.length).to.equal(1);
//      })
//
//    });
//
//  });
//
//  Scenario.skip('Consider Todays Pre-bookings: 7am - 6:59am', () => {
//
//    Scenario('New Pre-bookings replace existing pre-bookings', () => {
//
//      before(function () {
//        global.testConfig.initializeBarrelsFixtures = false;
//      });
//
//      after(function () {
//        global.testConfig.initializeBarrelsFixtures = true;
//      });
//
//      Given('centre `' + centreEventAttrs.name + '` Pre-booking counts exist', () => {
//
//        global.initializeBarrelsFixtures()
//          .then(() =>
//            CentreEvent.create(centreEventAttrs)
//              .then(() =>
//                getSearchResult()
//                  .then((models) => {
//                    expect(models[0].name).to.equal(centreEventAttrs.name);
//                  })
//              )
//          )
//          .then(() =>
//            PrebookingEvent.create(prebookingEventAttrs)
//              .then(() =>
//                getSearchResult()
//                  .then((models) => {
//                    expect(models[0].centre).to.equal(centreEventAttrs.name);
//                  })
//              )
//          )
//
//      });
//
//      When('a valid pre-booking event for centre `' + centreEventAttrs.name + '` occurs', () => {
//
//        request(sails.hooks.http.app)
//          .post('/depmu_entry/prebooking')
//          .send(prebookingPayload)
//          .expect(201)
//
//      });
//
//      Then('centre `' + centreEventAttrs.name + '` existing Pre-booking count is overwritten', () => {
//
//        getSearchResult().then((models) => {
//          expect(models.length).to.equal(1);
//          expect(models[0].gender).to.equal('female');
//        })
//
//      });
//
//    });
//
//    Scenario.skip('Remove Existing Pre-booking when Movement In Order occurs', () => {
//
//      before(function () {
//        global.testConfig.initializeBarrelsFixtures = false;
//      });
//
//      after(function () {
//        global.testConfig.initializeBarrelsFixtures = true;
//      });
//
//      Given('centre `' + centreEventAttrs.name + '` has an existing ' + centreEventAttrs.gender + ' Pre-booking with cid id `' + cid_id + '`', () => {
//
//        global.initializeBarrelsFixtures()
//          .then(() =>
//            CentreEvent.create(centreEventAttrs)
//              .then(() =>
//                getSearchResult()
//                  .then((models) => {
//                    expect(models[0].name).to.equal(centreEventAttrs.name);
//                  })
//              )
//          )
//          .then(() =>
//            PrebookingEvent.create(prebookingEventAttrs)
//              .then(() =>
//                getSearchResult()
//                  .then((models) => {
//                    expect(models[0].centre).to.equal(centreEventAttrs.name);
//                    expect(models[0].cid_id).to.equal(prebookingEventAttrs.cid_id);
//                  })
//              )
//          )
//
//      });
//
//      When('a valid movement-in order event with cid id `' + movementPayload.cid_id + '` occurs', () => {
//
//        request(sails.hooks.http.app)
//          .post('/cid_entry/movement')
//          .send(movementPayload)
//          .expect(201)
//
//      });
//
//      Then('centre `' + centreEventAttrs.name + '` ' + centreEventAttrs.gender + ' Pre-booking count decreases by 1', () => {
//
//        getSearchResult().then((models) => {
//          expect(models.length).to.equal(0);
//        })
//
//      });
//
//    });
//
//    Scenario.skip('Ignore Pre-bookings with existing Movement In Order', () => {
//      before(function () {
//        global.testConfig.initializeBarrelsFixtures = false;
//      });
//
//      after(function () {
//        global.testConfig.initializeBarrelsFixtures = true;
//      });
//
//      Given('centre `' + centreEventAttrs.name + '` exists', () => {
//
//        global.initializeBarrelsFixtures()
//          .then(() =>
//            CentreEvent.create(centreEventAttrs)
//              .then(() =>
//                getSearchResult()
//                  .then((models) => {
//                    expect(models[0].name).to.equal(centreEventAttrs.name);
//                  })
//              )
//          )
//
//      });
//      And('a movement-in order with cid id `' + movementEventAttrs.cid_id + '` exists ', () => {
//
//        global.initializeBarrelsFixtures()
//          .then(() =>
//            MovementOrderEvent.create(movementEventAttrs)
//              .then(() =>
//                getSearchResult()
//                  .then((models) => {
//                    expect(models[0].cid_id).to.equal(movementEventAttrs.cid_id);
//                  })
//              )
//          )
//
//      });
//
//      When('a valid pre-booking event for centre `' + centreEventAttrs.name + '` with cid id `' + movementEventAttrs.cid_id + '` occurs', () => {
//
//        request(sails.hooks.http.app)
//          .post('/depmu_entry/prebooking')
//          .send(prebookingPayload)
//          .expect(201)
//
//      });
//
//      Then('centre `' + centreEventAttrs.name + '` Pre-booking count remains unchanged', () => {
//
//        getSearchResult().then((models) => {
//          expect(models.length).to.equal(0);
//        })
//
//      });
//
//    });
//  });
//});
//
//
