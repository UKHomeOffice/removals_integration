var Sails = require('sails');
var Barrels = require('barrels');
var freeport = require('freeport');
var barrels = new Barrels();

global.chai = require('chai')
  .use(require('chai-as-promised'))
  .use(require('sinon-chai'));
global.expect = chai.expect;
global._ = require('lodash');
global.request = require('supertest-as-promised');
global.sinon = require('sinon');
require('sinon-as-promised')(require('bluebird'));


// Global before hook
before(function (done) {
  // Lift Sails with test database
  freeport(function (err, port) {
    if (err) throw err;

    Sails.lift({
      hooks: {
        grunt: false,
        i18n: false
      },
      log: {
        level: 'verbose'
      },
      models: {
        connection: 'test',
        migrate: 'drop'
      },
      port: port
    }, function (err, sails) {
      if (err) {
        return done(err);
      }
      done(err, sails);
    });
  });
});

beforeEach(function (done) {
  // Load fixtures
  return barrels.populate(function () {
    done();
  });
});

// Global after hook
after(function (done) {
  sails.lower(done);
});
