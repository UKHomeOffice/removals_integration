global.Sails = require('sails');
global.Barrels = require('barrels');
global.freeport = require('freeport');
global.barrels = new Barrels;
global.chai = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-things'))
  .use(require('sinon-chai'));
global.expect = chai.expect;
global._ = require('lodash');
global.sinon = require('sinon');
require('sinon-as-promised')(require('bluebird'));
global.request = require('supertest-as-promised');
global.request_auth = app =>
  require('superagent-defaults')(global.request(app))
    .set('HTTP_EMAIL', 'test@example.com');

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

        barrels.populate(done);
      });
    });
  },
  after: done => {
    sails.lower(done);
  }
};
