module.exports = function () {
  return {
    files: [
      'api/**/*.*',
      'config/**/*.*',
      'test/helpers/**/*.*'
    ],

    tests: [
      'test/**/*.js',
      'test/**/*.json',
      '!test/bootstrap.test.js',
      '!test/helpers/**.js'
    ],

    bootstrap: function (wallaby) {
      if (global.sails) return;

      wallaby.delayStart();

      wallaby.testFramework.ui('bdd');

      require('magic-globals');
      process.env.NODE_PATH = __base;
      require('module').Module._initPaths();
      global.chai = require('chai');
      //global.expect = chai.expect;

      var freeport = require('freeport');
      var path = require('path');
      var fs = require('fs');
      var existsSync = fs.existsSync;

      // Replacing existsSync to make sails not throw error when it doesn't find node module in wallaby cache.
      // Wallaby will use local node module anyway.
      fs.existsSync = function (filePath) {
        if (filePath && filePath.indexOf(path.join('instrumented', 'node_modules'))) {
          return true;
        }
        return existsSync.apply(this, arguments);
      };

      var Sails = require('sails');

      var Barrels = require('barrels');

      freeport(function (err, port) {
          if (err) throw err;

          // Lift Sails with test database
          global.sails = Sails.lift({
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
          }, function (err) {
            if (err) {
              if (err) throw err;
              wallaby.start();
            }

            // Load fixtures
            var barrels = new Barrels();

            // Save original objects in `fixtures` variable
            fixtures = barrels.data;

            // Populate the DB
            barrels.populate(function (err) {
              if (err) throw err;
              wallaby.start();
            });
          });
        }
      );
    },
    env: {
      type: 'node'
    }
  };
};
