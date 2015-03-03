module.exports = function(grunt) {
    grunt.initConfig({
        fixtures: {
            import_test_data: {
                src: ['fixtures/*.json'],
                models: function () {
                    return require('./node/models');
                },
                options: { //specify encoding options. default utf-8
                    //encoding: 'windows-1257'
                }
            }
        },

        debug: true
    });

    grunt.loadNpmTasks('sequelize-fixtures');

    grunt.registerTask('install-fixtures', 'fixtures');


    grunt.registerTask('clear-db', function() {
        console.log('Teardown and rebuild the database');
        var db = require('./node/db').db,
            sequelize = db.sequelize,
            models = require('./node/models').models;

        sequelize.sync({ force: true });

        for (var m in models) {
            console.log(m);
            if (models.hasOwnProperty(m)) {
                var model = models[m];
                //model.drop();
                //model.sync();
            }
        }
    });
};
