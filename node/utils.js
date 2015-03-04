var CONFIG = require('./config').config,
    sequelize_fixtures = require('sequelize-fixtures'),
    models = require('./models').models;

function install_fixtures() {
    sequelize_fixtures.loadFile(CONFIG.project_path + 'fixtures/*.json', models)
    .then(function(){
        //doStuffAfterLoad();
    });
}

exports.utils = {
    install_fixtures: install_fixtures
};