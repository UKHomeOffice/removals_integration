var Sails = require('sails');
var Barrels = require('barrels');
var Promise = require('bluebird');
var request = require('supertest-as-promised');
var _ = require('lodash');
var centres = ['bigone', 'smallone', 'harmondsworth'];
var jhg = require('../test/helpers/JsonHelperGenerator');
var schema = require('removals_schema').heartbeat;
schema.properties.centre.faker = 'custom.centre';

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
      var loop = function () {
        var custom_fakes = {
          centre: centres[_.random(0, centres.length - 1)]
        };
        var update_json = jhg(schema, custom_fakes);
        sails.log("updating " + update_json.centre);
        return request(sails.hooks.http.app)
          .post('/Irc_Entry/heartbeat')
          .send(update_json)
          .expect(200)
          .toPromise()
          .delay(200)
          .finally(loop);
      };
      return loop();
    });
  }
)
;
