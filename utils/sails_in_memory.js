var Sails = require('sails');
var Barrels = require('barrels');
var Promise = require('bluebird');
var request = require('supertest-as-promised');
var base_json = require('../test/scenarios/bed_in_of_commission.json');
var _ = require('lodash');
var centres = ['bigone', 'smallone', 'harmondsworth'];

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
        update_json = _.assign(base_json, {
          centre: centres[_.random(0, centres.length - 1)],
          bed_counts: {
            male: _.random(0, 50),
            female: _.random(0, 50),
            out_of_commission: {
              ooc_male: _.random(0, 50),
              ooc_female: _.random(0, 50)
            }
          }
        });
        sails.log("updating " + update_json.centre);
        return request(sails.hooks.http.app)
          .post('/IrcPost')
          .send(update_json)
          .expect(200)
          .toPromise()
          .delay(200)
          .then(loop);
      };
      return loop();
    });
  }
);