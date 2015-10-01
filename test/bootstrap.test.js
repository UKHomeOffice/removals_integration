var Sails = require('sails');
var Barrels = require('barrels');
var freeport = require('freeport');


// Global before hook
before(function (done) {
  // Lift Sails with test database
  freeport(function (err, port) {
    if (err) throw err;

    Sails.lift({
      hooks: {
        grunt: false,
        i18n: false,
        sockets: false,
        pubsub: false
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
      // Load fixtures
      var barrels = new Barrels();

      // Save original objects in `fixtures` variable
      var fixtures = barrels.data;

      // Populate the DB
      barrels.populate(function (err) {
        done(err, sails);
      });
    });
  });
});

// Global after hook
after(function (done) {
  console.log(); // Skip a line before displaying Sails lowering logs
  sails.lower(done);
});
