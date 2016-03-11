// 'use strict';

// Feature('Check In Event Integration with Movement Orders', () => {

//   var makeRequest = payload =>
//     request(sails.hooks.http.app)
//       .post('/irc_entry/event')
//       .send(payload);

//   var recreate = (attrs) =>
//     Movement.destroy()
//       .then(() => Movement.create(attrs))

//   var findAndPop = (relation) =>
//     Movement.find().populate(relation)

//   before(function () {
//     global.testConfig.initializeBarrelsFixtures = false;
//     // sinon.stub(Centres, 'update');
//   });

//   after(function () {
//     global.testConfig.initializeBarrelsFixtures = true;
//     // Centres.update.restore();
//   });

//   Scenario('Scheduled count does not include resolved movement orders', () => {

//     var date = new Date();
//     var dateString = date.toISOString();

//     var cid_id = 100;

//     var eventPayload = {
//       person_id: 123,
//       cid_id: cid_id,
//       operation: 'check in',
//       timestamp: dateString,
//       gender: 'm',
//       nationality: 'gbr',
//       centre: 'abc'
//     };

//     var subject = {
//       gender: 'male',
//       cid_id: cid_id
//     };

//     var centre = {
//       name: "abc",
//       male_capacity: 222,
//       female_capacity: 333,
//       mo_type: "non-occupancy",
//       male_cid_name: ["abc", "xyz"],
//       female_cid_name: ["aaa", "bbb", "ccc"]
//     };

//     var movement = {
//       centre: centre,
//       subjects: subject,
//       id: '999',
//       direction: 'In',
//       active: true
//     };

//     Given('there is a movement order for a detainee with cid_id ' + cid_id + ' for the current day', () =>

//       recreate(movement).then(createdMovement =>
//         Subjects.findOne({id: createdMovement.subjects}).then(subject => {
//           console.log(subject.createdAt)
//           expect(subject.cid_id).to.equal(cid_id)
//         })
//       )

//     );

//     When('a valid check in request with cid_id ' + cid_id + ' is made', () =>
//       makeRequest(eventPayload).expect(201)
//     );

//     Then('scheduled count does not include the movement order for the detainee with the cid_id ' + cid_id + '', () =>

//       // there is a scheduled count for each centre
//       // it depicts the number of men/women coming in/out of a centre
//       //
//       findAndPop('centre').then(movementModels =>
//         movementModels.forEach(model => {
//           if (model && model.subjects) {
//             expect(model.centre.maleActiveMovementsIn).to.equal(0);
//             // WRONG!
//             // We need to check that the scheduled count for active males in is decremented by 1

//             console.log('!model!', model)
//             // expect(model.subjects.cid_id).to.not.equal(cid_id);
//           }
//         })
//       )

//     );

//   });

//   Scenario('Scheduled count does include unresolved movement orders', () => {

//     var date = new Date();
//     var dateString = date.toISOString();

//     var event_cid_id = 200;

//     var eventPayload = {
//       person_id: 123,
//       cid_id: event_cid_id,
//       operation: 'check in',
//       timestamp: dateString,
//       gender: 'm',
//       nationality: 'gbr',
//       centre: 'xyz'
//     };

//     var cid_id = 100;

//     var subject = {
//       gender: 'male',
//       cid_id: cid_id
//     };
//     var centre = {
//       name: "xyz",
//       male_capacity: 222,
//       female_capacity: 333,
//       mo_type: "non-occupancy",
//       male_cid_name: ["abc", "xyz"],
//       female_cid_name: ["aaa", "bbb", "ccc"]
//     };
//     var movement = {
//       centre: centre,
//       subjects: subject,
//       id: '999',
//       direction: 'In',
//       active: true
//     };

//     Given('there is no movement order for a subject with ' + event_cid_id, () =>

//       recreate(movement).then(createdMovement =>
//         Subjects.findOne({id: createdMovement.subjects}).then(subject => {
//           expect(subject.cid_id).to.not.equal(event_cid_id);
//           expect(subject.cid_id).to.equal(cid_id);
//         })
//       )

//     );

//     When('a valid check in event request with cid_id ' + event_cid_id + ' is made', () =>
//       makeRequest(eventPayload).expect(201)
//     );

//     Then('the scheduled count is unaffected', () =>

//       findAndPop('subjects').then(movementModels =>
//         movementModels.forEach(model => expect(model.subjects.cid_id).to.equal(cid_id))
//       )

//     );

//   });

//   Scenario('Scheduled count does include unresolved movement orders made on previous days', () => {

//     var date = new Date();
//     date.setDate(date.getDate() + 1);
//     var dateString = date.toISOString();

//     var cid_id = 100;

//     var eventPayload = {
//       person_id: 123,
//       cid_id: cid_id,
//       operation: 'check in',
//       timestamp: dateString,
//       gender: 'm',
//       nationality: 'gbr',
//       centre: 'ccc'
//     };

//     var subject = {
//       gender: 'male',
//       cid_id: cid_id
//     };

//     var centre = {
//       name: "ccc",
//       id: 300,
//       male_capacity: 222,
//       female_capacity: 333,
//       mo_type: "non-occupancy",
//       male_cid_name: ["abc", "xyz"],
//       female_cid_name: ["aaa", "bbb", "ccc"]
//     };

//     var movement = {
//       centre: centre,
//       subjects: subject,
//       id: '999',
//       direction: 'In',
//       active: true
//     };

//     Given('there is a movement order for a subject with ' + cid_id, () =>

//       recreate(movement).then(createdMovement =>
//         Subjects.findOne({id: createdMovement.subjects}).then(subject =>
//           expect(subject.cid_id).to.equal(cid_id)
//         )
//       )

//     );

//     When('a valid check in event request with cid_id ' + cid_id + ' is made on the following day', () =>
//       makeRequest(eventPayload).expect(201)
//     );

//     Then('the scheduled count is unaffected', () =>

//       findAndPop('subjects').then(movementModels =>
//         expect(movementModels[0].subjects.cid_id).to.equal(cid_id)
//       )

//     );

//   });

// });
