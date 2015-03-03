module.exports = function(grunt) {
    grunt.initConfig({
        installFixtures: {
            import_test_data: {
                src: ['fixtures/*.json'],
                models: function () {
                    CONFIG = require('./node/config');
                    return require('./node/models');
                },
                options: { //specify encoding options. default utf-8
                    //encoding: 'windows-1257'
                }
            }
        }

    });

    grunt.loadNpmTasks('sequelize-fixtures');

    grunt.registerTask('install-fixtures', 'installFixtures');
};
