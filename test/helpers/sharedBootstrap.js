global.rewire = require('rewire');
global.Sails = require('sails');
global.Barrels = require('barrels');
global.freeport = require('freeport');
global.barrels = new Barrels();

global.chai = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-things'))
  .use(require('sinon-chai'))
  .use(require('chai-datetime'));
global.expect = chai.expect;
global.should = chai.should();
global._ = require('lodash');
global.sinon = require('sinon');
global.initializeBarrelsFixtures = function () {
  return new Promise(function (resolve) {
    barrels.populate([
      'centres',
      'subjects',
      'movement',
      'detainee',
      'event'
    ], function (err) {
      if (err) throw err;
      resolve();
    });

  });
};
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
