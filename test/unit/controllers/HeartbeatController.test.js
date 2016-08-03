/* global Heartbeat */
'use strict';

const Validator = require('jsonapi-validator').Validator;
var validator = new Validator();

describe('INTEGRATION HeartbeatController', () => {
    var centre;

    beforeEach(() => Centres.create({name: _.uniqueId("test")})
      .then(newcentre => centre = newcentre)
    );

    afterEach(() => centre.destroy());

    it('should be able to get a list of all the heartbeats', () =>
      request(sails.hooks.http.app)
        .get('/heartbeat')
        .expect(200)
        .then(res => expect(res.body.data).to.have.length(100))
    );

    it('should be able to get a list of all the heartbeats for a given centre', () =>
      request(sails.hooks.http.app)
        .get('/heartbeat?&where={"centre":1}')
        .expect(200)
        .then(res => expect(res.body.data).to.have.length(37))
    );

    it('should be able to get a list of all the heartbeats for a given centre and a given time period', () =>
      request(sails.hooks.http.app)
        .get('/heartbeat?&where={"centre":1, "createdAt":{"lessThan": "2016-01-18T06:24:26Z", "greaterThan": "2016-01-10T06:24:26Z"}}')
        .expect(200)
        .then(res => expect(res.body.data).to.have.length(7))
    );

    it('should be able to get a summary of the heartbeats for a given time period', () =>
      request(sails.hooks.http.app)
        .get('/heartbeat/summary?&where={"createdAt":{"lessThan": "2016-01-18T06:24:26Z", "greaterThan": "2016-01-10T06:24:26Z"}}')
        .expect(200)
        .then(res => expect(res.body.data).to.eql([
          {
            "centre": "bigone",
            "femaleInUse": {
              "max": 94,
              "mean": 45.57142857142857,
              "min": 15
            },
            "femaleOutOfCommission": {
              "max": 91,
              "mean": 47.857142857142854,
              "min": 16
            },
            "maleInUse": {
              "max": 98,
              "mean": 63.285714285714285,
              "min": 19
            },
            "maleOutOfCommission": {
              "max": 97,
              "mean": 45.57142857142857,
              "min": 12
            }
          },
          {
            "centre": "smallone",
            "femaleInUse": {
              "max": 92,
              "mean": 66.8,
              "min": 44
            },
            "femaleOutOfCommission": {
              "max": 70,
              "mean": 35.4,
              "min": 9
            },
            "maleInUse": {
              "max": 90,
              "mean": 59,
              "min": 35
            },
            "maleOutOfCommission": {
              "max": 92,
              "mean": 47.6,
              "min": 10
            }
          },
          {
            "centre": "anotherone",
            "femaleInUse": {
              "max": 98,
              "mean": 40.375,
              "min": 11
            },
            "femaleOutOfCommission": {
              "max": 65,
              "mean": 33.125,
              "min": 5
            },
            "maleInUse": {
              "max": 93,
              "mean": 40,
              "min": 3
            },
            "maleOutOfCommission": {
              "max": 80,
              "mean": 39.5,
              "min": 1
            },
          }
        ]))
    );
  }
);
