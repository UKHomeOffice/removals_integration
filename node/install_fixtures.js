var models = require('./models').models,
    utils = require('./utils').utils,

    CONFIG = require('./config').config;

utils.import_csv(
    /*CONFIG.project_path + '/fixtures/nationalities.csv',
    models.Nationality,
    true,
    null*/
    CONFIG.project_path + '/fixtures/centres.csv',
    models.Centre,
    true,
    null
);
