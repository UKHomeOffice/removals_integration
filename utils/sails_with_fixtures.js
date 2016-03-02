var Sails = require('sails');
var Barrels = require('barrels');
var Promise = require('bluebird');
var request = require('supertest-as-promised');
var _ = require('lodash');

Sails.lift(
  {
    port: 8080,
    models: {
      connection: 'test',
      migrate: 'drop'
    }
  },
  function (err, sails) {
    var barrels = new Barrels();
    barrels.populate(function (err) {
      sails.log('up');
    });
  }
)
;
