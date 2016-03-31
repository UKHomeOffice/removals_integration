var Sails = require('sails');
var Barrels = require('barrels');
var Promise = require('bluebird');
var request = require('supertest-as-promised');
var _ = require('lodash');
var moment = require('moment-timezone');
var centres = ['bigone', 'smallone', 'anotherone'];
var taskForces = ['ops1', 'ops2', 'htc'];
var locations = ['bigone male holding', 'smallone male holding', 'bigone female office', 'smallone female holding', 'smale one male unit', 'medium one male unit', 'large one male unit', 'small one unit', 'other one unit', 'anotherone unit', 'other female unit', 'anotherone female unit', 'last one female unit'];
var jhg = require('../test/helpers/JsonHelperGenerator');
var heartbeatschema = require('removals_schema').heartbeat;
var cidschema = require('../api/services/CidEntryMovementValidatorService').schema;
var depmuschema = require('../api/services/DepmuEntryPrebookingValidatorService').schema;
var properties_to_change = ['female_occupied', 'male_occupied', 'male_outofcommission', 'female_outofcommission'];
var directions = ['In', 'Out'];
moment.tz.setDefault("Europe/London");
heartbeatschema.properties.centre.faker = 'custom.centre';
cidschema.definitions.Location.faker = 'custom.location';
cidschema.definitions.InOut.faker = 'custom.direction';
cidschema.definitions.MORef.faker = 'custom.integer';
depmuschema.definitions.location.faker = 'custom.location';

Sails.lift(
  {
    port: 8080,
    log: {
      level: 'verbose'
    },
    models: {
      connection: 'test',
      migrate: 'drop'
    }
  },
  function (err, sails) {
    var barrels = new Barrels();
    barrels.populate(function (err) {
      sails.log("database is now in sync");
      var last_heartbeat_data = {};
      var loop = function () {
        var custom_fakes = {
          centre: centres[_.random(0, centres.length - 1)],
          location: locations[_.random(0, locations.length - 1)],
          direction: directions[_.random(0, directions.length - 1)],
          integer: _.random(0, 1000000).toString(),
          cid_id: _.random(0, 1000000).toString(),
          timestamp: moment().set({hour: 7, minute: 0, second: 0}).format(),
          task_force: taskForces[_.random(0, centres.length - 1)],
        };

        /**
         * Depmu Prebookings
         */
        var depmu_data = jhg(depmuschema, custom_fakes);

        /**
         * IRC Centre Update: Heartbeat
         */
        var heartbeat_data = jhg(heartbeatschema, custom_fakes);
        if (last_heartbeat_data[heartbeat_data.centre]) {
          heartbeat_data = last_heartbeat_data[heartbeat_data.centre];
          heartbeat_data[properties_to_change[_.random(0, properties_to_change.length - 1)]] += _.random(-5, 5);
        }
        last_heartbeat_data[heartbeat_data.centre] = heartbeat_data;
        sails.log("updating " + heartbeat_data.centre);

        /**
         * CID: Movement Orders
         */
        var cid_data = jhg(cidschema, custom_fakes);

        var requests = [
          request(sails.hooks.http.app)
            .post('/depmu_entry/prebooking')
            .send(depmu_data),

          request(sails.hooks.http.app)
            .post('/cid_entry/movement')
            .send(cid_data),

          request(sails.hooks.http.app)
            .post('/irc_entry/heartbeat')
            .send(heartbeat_data)
        ];

        return Promise.all(requests).delay(500).finally(loop);
      };
      return loop();
    });
  }
);


