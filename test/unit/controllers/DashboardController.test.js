"use strict";
var controller = require('../../../api/controllers/DashboardController');

describe('INTEGRATION DashboardController', () => {

  it('should respond with a 200 ok', () => {
    request(sails.hooks.http.app)
      .get('/dashboard')
      .expect(200)
  });

  it('should return the 3 centres', () =>
    request(sails.hooks.http.app)
      .get('/dashboard')
      .then(response => response.body.data)
      .tap(data => expect(data).to.have.length(3))
      .tap(data => expect(data).to.contain.a.thing.with.property('name', 'bigone'))
  );

  it('should include the planned movements for each centre', () =>
    request(sails.hooks.http.app)
      .get('/dashboard')
      .then(response => response.body.data)
      .tap(console.log)
      .tap(data => expect(data).to.contain.a.thing.with.property('male_movements', 2))
      .tap(data => expect(data).to.contain.a.thing.with.property('female_movements', 1))
  );
  beforeEach(() => {
    sinon.stub(sails.sockets, 'join');
    sinon.stub(sails.sockets, 'broadcast');
  });
  afterEach(() => {
    sails.sockets.join.restore();
    sails.sockets.broadcast.restore();
  });

  it('should auto subscribe you to the dashboard to receive further updates');

  it('should publish an update event when a centre is updated');

  it('should publish a update event an active movement is added');
  it('should not publish a update event an inactive movement is added');

  it('should publish a update event an active movement is updated');
  it('should not publish a update event an inactive movement is updated');

  it('should publish a update event an active movement is deleted');
  it('should not publish a update event an inactive movement is deleted');

  it('should publish a update event an active movement is made inactive');

});

describe('UNIT DashboardController', () => {
});
