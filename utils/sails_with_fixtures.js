'use strict';

const Sails = require('sails');
const Barrels = require('barrels');
const Promise = require('bluebird');
const request = require('supertest-as-promised');
const _ = require('lodash');

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
    barrels.populate([
      'centres',
      'detainee',
      'event',
      'movement',
      'heartbeat',
      'prebooking',
      'bed',
      'bedevent'
    ], function (err) {
      sails.log('up');
    });
  }
)
;
