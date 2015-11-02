module.exports = () => {
  return {
    files: [
      'api/**/*.*',
      'config/**/*.*',
      'test/helpers/**/*.*',
      'node_modules/removals_dashboard/assets/schema/*'
    ],

    tests: [
      'test/**/*.js',
      '!test/bootstrap.test.js',
      'test/**/*.json',
      '!test/helpers/**.js'
    ],


    bootstrap: wallaby => {
      if (global.sails) return;

      wallaby.delayStart();

      wallaby.testFramework.ui('bdd');
      bootstrap = require('./test/helpers/sharedBootstrap');

      require('magic-globals');
      process.env.NODE_PATH = __base;
      require('module').Module._initPaths();

      var freeport = require('freeport');
      var path = require('path');
      var fs = require('fs');
      var existsSync = fs.existsSync;

      // Replacing buildDictionary.optional to resolve hooks from local node_modules
      var buildDictionary = require('sails/node_modules/sails-build-dictionary');
      var originalOptional = buildDictionary.optional;
      buildDictionary.optional = function () {
        if (~arguments[0].dirname.indexOf('node_modules')) {
          arguments[0].dirname = path.join(wallaby.localProjectDir, 'node_modules');
        }
        return originalOptional.apply(this, arguments);
      };

      // Replacing existsSync to make sails not throw error when it doesn't find node module in wallaby cache.
      // Wallaby will use local node module anyway.
      fs.existsSync = (filePath) => {
        if (filePath && filePath.indexOf(path.join('instrumented', 'node_modules'))) {
          return true;
        }
        return existsSync.apply(this, arguments);
      };
      bootstrap.before(() => wallaby.start());
    },
    env: {
      type: 'node',
      runner: 'node'
    }
  };
};
