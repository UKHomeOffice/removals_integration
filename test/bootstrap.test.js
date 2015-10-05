var Sails = require('sails');
var Barrels = require('barrels');
var freeport = require('freeport');

var barrels = new Barrels();

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

beforeEach(function () {
  // Load fixtures
  return barrels.populate();
});

// Global after hook
after(function (done) {
  console.log(); // Skip a line before displaying Sails lowering logs
  sails.lower(done);
});
