'use strict';

global.rewire = require('rewire');
global.Sails = require('sails');
global.Barrels = require('barrels');
global.freeport = require('freeport');
global.barrels = new Barrels();
global.moment = require('moment-timezone');
global.chai = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-things'))
  .use(require('sinon-chai'))
  .use(require('chai-datetime'));
global.expect = chai.expect;
global._ = require('lodash');
global.lodash = require('lodash');
global.sinon = require('sinon');
const Promise = require('bluebird');
global.initializeBarrelsFixtures = () =>
  setupFixtures()
    .then(() => {
      Sails.adapters['sails-memory-restorable'].restoreState('test');
    });

var setupFixtures = _.once(() => new Promise((resolve) =>
  barrels.populate([
    'centres',
    'subjects',
    'movement',
    'detainee',
    'event',
    'heartbeat',
    'prebooking',
    'bed',
    'bedevent'
  ], (err) => {
    if (err) throw err;
    Sails.adapters['sails-memory-restorable'].saveState('test');
    resolve();
  })
));

require('mocha-cakes-2');
require('sinon-as-promised')(require('bluebird'));
global.request = require('supertest-as-promised');
var date = new Date();
date.setDate(date.getDate() + 1);
global.request_auth = app =>
  require('superagent-defaults')(global.request(app))
    .set('x-auth-email', 'foo.bar@digital.homeoffice.gov.uk')
    .set('x-auth-expiresin', date.toUTCString())
    .set('x-auth-roles', '')
    .set('x-auth-subject', 'test')
    .set('x-auth-token', 'ejkosjlkj3elkjlkj')
    .set('x-auth-userid', 'af53a021-94a9-4f3c-b70d-1df33a6c881e')
    .set('x-auth-username', 'foobar')
    .set('x-forwarded-agent', 'keycloak-proxy')
    .set('x-forwarded-for', '127.0.0.1:38880, 127.0.0.1')
    .set('x-forwarded-proto', 'https')
    .set('x-forwarded-proto$', 'https')
    .set('x-real-ip', '127.0.0.1');

global.testConfig = {
  initializeBarrelsFixtures: true
};

global.createRequest = (payload, path, res) => {
  var conditional_delay;

  // cid movements take ages to process out of the request/response cycle
  // so we need to do some magic to wait until they're done before the asserts can happen
  if (path == '/cid_entry/movement') {
    let controller = require("../../api/controllers/Cid_EntryController")
    sinon.spy(Centres, 'publishUpdateAll')
    conditional_delay = () =>
      new Promise((resolve) => {
        let interval = setInterval(() => {
          if (Centres.publishUpdateAll.called) {
            Centres.publishUpdateAll.restore()
            resolve()
            clearInterval(interval);
          }
        }, 10);
      });
  }
  return request_auth(sails.hooks.http.app)
    .post(path)
    .send(payload)
    .expect(res)
    .toPromise()
    .tap(conditional_delay);
};

global.assertCentresHTTPResponse = (key, value) =>
  global.request(sails.hooks.http.app)
    .get('/centres')
    .expect(200)
    .expect(res =>
      expect(lodash.get(res.body.data[0].attributes, key)).to.deep.equal(value)
    );

module.exports = {
  before: done => {
    freeport((err, port) => {
      if (err) throw err;

      Sails.lift({
        hooks: {
          grunt: false,
          i18n: false,
          cors: false,
          csrf: false,
          views: false,
          "sails-bunyan-request-logging": false,
          skipper: false
        },
        log: {
          level: 'verbose'
        },
        models: {
          connection: 'test',
          migrate: 'drop'
        },
        port: port
      }, err => {
        if (err) throw err;
        done();
      });
    });

  },
  beforeEach: () => {
    if (global.testConfig.initializeBarrelsFixtures) {
      return initializeBarrelsFixtures();
    }
  },
  after: done => {
    Sails.lower(done);
  }
};
