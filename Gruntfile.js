"use strict";
const sailsDbMigrate = require('sails-db-migrate');

module.exports = grunt => {
  grunt.registerTask('default', []);
  grunt.registerTask('prod', []);
  sailsDbMigrate.gruntTasks(grunt);
};
